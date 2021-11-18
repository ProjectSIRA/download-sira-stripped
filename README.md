# Download SIRA Stripped
Downloads stripped files for CI from the SIRA CDN. Designed for open source Beat Saber mods.

## Usage


```yaml
- name: Download Stripped References
  uses: ProjectSIRA/download-sira-stripped
  with:
    # SIRA Server Code. This should be a secret.
    sira-server-code: 'put-api-code-here'
    # (Optional) manifest location
    manifest: ${{github.workspace}}/manifest.json
    # (Optional) extract location
    path: ${{github.workspace}}/Refs
```
