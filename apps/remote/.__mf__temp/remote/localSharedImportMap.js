
// Windows temporarily needs this file, https://github.com/module-federation/vite/issues/68

    const importMap = {
      
        "react": async () => {
          let pkg = await import("__mf__virtual/remote__prebuild__react__prebuild__.js")
          return pkg
        }
      ,
        "react-dom": async () => {
          let pkg = await import("__mf__virtual/remote__prebuild__react_mf_2_dom__prebuild__.js")
          return pkg
        }
      ,
        "@ant-design/pro-components": async () => {
          let pkg = await import("__mf__virtual/remote__prebuild___mf_0_ant_mf_2_design_mf_1_pro_mf_2_components__prebuild__.js")
          return pkg
        }
      ,
        "antd": async () => {
          let pkg = await import("__mf__virtual/remote__prebuild__antd__prebuild__.js")
          return pkg
        }
      
    }
      const usedShared = {
      
          "react": {
            name: "react",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "remote",
            async get () {
              usedShared["react"].loaded = true
              const {"react": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "18.3.1"
            }
          }
        ,
          "react-dom": {
            name: "react-dom",
            version: "18.3.1",
            scope: ["default"],
            loaded: false,
            from: "remote",
            async get () {
              usedShared["react-dom"].loaded = true
              const {"react-dom": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "18.3.1"
            }
          }
        ,
          "@ant-design/pro-components": {
            name: "@ant-design/pro-components",
            version: "2.8.0",
            scope: ["default"],
            loaded: false,
            from: "remote",
            async get () {
              usedShared["@ant-design/pro-components"].loaded = true
              const {"@ant-design/pro-components": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "2.8.0"
            }
          }
        ,
          "antd": {
            name: "antd",
            version: "5.22.2",
            scope: ["default"],
            loaded: false,
            from: "remote",
            async get () {
              usedShared["antd"].loaded = true
              const {"antd": pkgDynamicImport} = importMap 
              const res = await pkgDynamicImport()
              const exportModule = {...res}
              // All npm packages pre-built by vite will be converted to esm
              Object.defineProperty(exportModule, "__esModule", {
                value: true,
                enumerable: false
              })
              return function () {
                return exportModule
              }
            },
            shareConfig: {
              singleton: true,
              requiredVersion: "5.22.2"
            }
          }
        
    }
      const usedRemotes = [
      ]
      export {
        usedShared,
        usedRemotes
      }
      