import React, { useEffect, useState } from "react";
import { ConfigProvider, Tree, theme } from "antd";

const getInitTreeData = (componentName) => [
  {
    title: componentName,
    key: "0-0",
    children: [],
  },
];

const FileStructureTree = ({
  componentName,
  fileStructure,
  setCurrentFile,
}) => {
  const [fileTree, setFileTree] = useState([]);
  const formulaterTree = (fileStructure) => {
    const treeData = getInitTreeData(componentName);
    const resultFileStruct = fileStructure.map((item, index) => ({
      title: item.file_name,
      key: `1-${index}`,
      file_content: item.file_content,
    }));
    treeData[0].children = resultFileStruct;
    console.log("set treeData");
    console.log(treeData);
    setFileTree(treeData);
  };

  const onFileTreeSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    const { title: file_name, file_content } = info.node;
    setCurrentFile({ file_name, file_content });
  };

  useEffect(() => {
    if (!fileStructure?.length) {
      return;
    }
    formulaterTree(fileStructure);
  }, [fileStructure]);

  return (
    <div>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <Tree
          showIcon
          defaultExpandedKeys={["0-0"]}
          expandedKeys={["0-0"]}
          onSelect={onFileTreeSelect}
          treeData={fileTree}
        />
      </ConfigProvider>
    </div>
  );
};

export default FileStructureTree;
