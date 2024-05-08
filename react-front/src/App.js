import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import {
  createComponent,
  editComponentFile,
  queryComponentList,
  queryFileStructure,
  compileComponent,
  createComponentFile,
  installDependencies,
} from "./api/talis";
import "./styles/index.css";
import "./styles/editor.less";
import { Button, Flex, Input, List, message } from "antd";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FileStructureTree from "./components/FileStructureTree";
function App() {
  const editorRef = useRef(null);
  const [componentList, setComponentList] = useState([]);
  const [fileStructure, setFileStructure] = useState([]);
  const [currentFile, setCurrentFile] = useState({
    file_name: "index.js",
    file_content: "",
  });
  const [componentName, setComponentName] = useState("");
  const [newFileName, setNewFileName] = useState("");

  const fetchFilesStructure = async (component_name) => {
    const hide = message.loading("Fetching files structure...", 0);
    try {
      setComponentName(component_name);
      const { data } = await queryFileStructure({
        component_name,
      });
      console.log("query file structure");
      console.log(data);
      setFileStructure(data);
      setCurrentFile(data[0]);
      hide();
      message.success("Files structure fetched successfully");
    } catch (error) {
      hide();
      message.error("Failed to fetch files structure");
    }
  };

  const fetchComponentList = async () => {
    const hide = message.loading("Fetching component list...", 0);
    try {
      const data = await queryComponentList();
      console.log(data);
      setComponentList(data);
      hide();
      message.success("Component list fetched successfully");
    } catch (error) {
      hide();
      message.error("Failed to fetch component list");
    }
  };

  const createComponentAndEdit = async () => {
    const hide = message.loading("Creating component...", 0);
    try {
      await createComponent({
        name: componentName,
      });
      hide();
      message.success("Component created successfully");
      await fetchComponentList();
    } catch (error) {
      hide();
      message.error("Failed to create component");
    }
  };

  const saveAllChanges = async () => {
    const hide = message.loading("Saving changes...", 0);
    try {
      for (let i = 0; i < fileStructure.length; i++) {
        const file = fileStructure[i];
        await editComponentFile({
          component_name: componentName,
          full_file_name: file.file_name,
          content: file.file_content,
        });
      }
      hide();
      message.success("All changes saved successfully");
    } catch (error) {
      hide();
      message.error("Failed to save changes");
    }
  };

  const createFile = async () => {
    const hide = message.loading("Creating file...", 0);
    try {
      await createComponentFile({
        component_name: componentName,
        full_file_name: newFileName,
      });
      hide();
      message.success("File created successfully");
      fetchFilesStructure(componentName);
    } catch (error) {
      hide();
      message.error("Failed to create file");
    }
  };

  const compileComponentFile = async () => {
    const hide = message.loading("Compiling component...", 0);
    try {
      await compileComponent({
        component_name: componentName,
      });
      hide();
      message.success("Component compiled successfully");
    } catch (error) {
      hide();
      message.error("Failed to compile component");
    }
  };

  const installDep = async () => {
    const hide = message.loading("Installing dependencies...", 0);
    try {
      await installDependencies({
        component_name: componentName,
      });
      hide();
      message.success("Dependencies installed successfully");
    } catch (error) {
      hide();
      message.error("Failed to install dependencies");
    }
  };

  useEffect(() => {
    React.startTransition(() => {
      fetchComponentList();
    });
  }, []);

  useEffect(() => {
    editorRef.current?.focus();
  }, [currentFile.file_name]);

  function handleEditorChange(value, event) {
    setFileStructure((prevFileStructure) => {
      const newFileStructure = [...prevFileStructure];
      const fileIndex = newFileStructure.findIndex(
        (file) => file.file_name === currentFile.file_name
      );
      if (fileIndex !== -1) {
        newFileStructure[fileIndex].file_content = value;
      }
      return newFileStructure;
    });
  }

  const refreshIframe = () => {
    const iframe = document.getElementById("preview-iframe");
    iframe.src = iframe.src;
  };

  return (
    <>
      <div>
        <div>
          <section style={{ marginBottom: "12px" }}>
            <Flex gap="small" wrap="wrap">
              <Input
                style={{ width: "120px" }}
                value={componentName}
                placeholder="组件名称"
                onChange={(e) => setComponentName(e.target.value)}
              />
              <Input
                style={{ width: "120px" }}
                value={newFileName}
                placeholder="新建文件"
                onChange={(e) => setNewFileName(e.target.value)}
              />
              <Button type="primary" onClick={createComponentAndEdit}>
                创建组件
              </Button>
              <Button type="primary" onClick={createFile}>
                新建文件
              </Button>
              <Button onClick={saveAllChanges}>保存修改</Button>
              <Button type="primary" ghost onClick={installDep}>
                安装依赖
              </Button>
              <Button type="primary" ghost onClick={compileComponentFile}>
                编译组件
              </Button>
              <Button type="primary" ghost onClick={refreshIframe}>
                刷新预览
              </Button>
            </Flex>
          </section>
        </div>
        <section className="talis-editor">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={15}>
              <FileStructureTree
                fileStructure={fileStructure}
                componentName={componentName}
                setCurrentFile={setCurrentFile}
              />
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <div className="flex-horizontal">
                <section className="file-viewer-section">
                  <Editor
                    height="80vh"
                    theme="vs-dark"
                    options={{ wordWrap: "on" }}
                    path={currentFile.file_name}
                    defaultLanguage={
                      currentFile.file_name.split(".")[1] === "js"
                        ? "javascript"
                        : "html"
                    }
                    defaultValue={currentFile.file_content}
                    onMount={(editor) => (editorRef.current = editor)}
                    onChange={handleEditorChange}
                  />
                </section>
              </div>
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <section>
                <iframe
                  id="preview-iframe"
                  src="http://localhost:3000/runner/index.html"
                ></iframe>
              </section>
            </Panel>
          </PanelGroup>
        </section>
      </div>
      <div>
        <List
          dataSource={componentList}
          renderItem={(component) => (
            <List.Item onClick={() => fetchFilesStructure(component.name)}>
              <List.Item.Meta
                title={<a>{component.name}</a>}
                description="Click the component to edit"
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
}

export default App;
