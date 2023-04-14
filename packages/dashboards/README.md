# Dashboards

## Export and Import
You can specify the following variables with `env.npm_config.` or `env.`:
 `xmurl`, `xmgrant`, `xmauth`, `xmauth`, `dist`, `target`, `deleteFile`.
##### Export
Use `export.js` to save the dashboards configurations into a file.
```shell script
XM_API=""
XM_AUTH_HEADER=""
XM_USERNAME=""
XM_PASSWORD=""
node export --xmurl=$XM_API --xmgrant="grant_type=password&username=${XM_USERNAME}&password=${XM_PASSWORD}" --xmauth=$XM_AUTH_HEADER
```
##### Import
You use `import.js` to upload dashboard configurations to your server from the file.
```shell script
node ./node_modules/@xm-ngx/dashboards/import.js --xmurl=\"{API}\" --xmgrant=\"grant_type=password&username={USERNAME}&password={PASSWORD}\" --xmauth=\"{AUTH_HEADER}\" --target="{DIST} --deleteFile=true",
```
