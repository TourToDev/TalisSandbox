import service from "./service";
export function queryComponentList(params) {
  return service({
    method: "get",
    url: "/get-component-list",
    params,
  });
}

export function queryFileStructure(params) {
  return service({
    method: "get",
    url: "/check-file-structure",
    params,
  });
}

export function createComponent(params) {
  return service({
    method: "get",
    url: "/create-component",
    params,
  });
}

export function editComponentFile(data) {
  return service({
    method: "post",
    url: "/edit-component-file",
    data,
  });
}

export function compileComponent(params) {
  return service({
    method: "get",
    url: "/compile-component",
    params,
  });
}

export function createComponentFile(params) {
  return service({
    method: "get",
    url: "/create-component-file",
    params,
  });
}

export function installDependencies(params) {
  return service({
    method: "get",
    url: "/install-dep",
    params,
  });
}
