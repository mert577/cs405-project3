# Project 3 Implementation Report

### Task 1: SceneNode Draw Method
1. **Purpose**: Implement hierarchical transformations in scene graph
2. **Steps**:
   - Get node's transformation matrix
   - Transform MVP, ModelView, Model matrices 
   - Transform normal matrix with inverse transpose
   - Draw current node's mesh
   - Recursively draw children

```javascript


draw(mvp, modelView, normalMatrix, modelMatrix) {
    let transformationMatrix = this.trs.getTransformationMatrix();
    
    let transformedMvp = utils.multiplyMatrices(mvp, transformationMatrix);
    let transformedModelView = utils.multiplyMatrices(modelView, transformationMatrix);
    let transformedModel = utils.multiplyMatrices(modelMatrix, transformationMatrix);
    let transformedNormals = utils.multiplyMatrices(normalMatrix, 
        utils.transposeMatrix(utils.invertMatrix(transformationMatrix)));

    if (this.meshDrawer) {
        this.meshDrawer.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
    }

    for (let child of this.children) {
        child.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
    }
}
```

### Task 2: Fragment Shader Lighting
1. **Purpose**: Implement Phong lighting model
2. **Components**:
   - Diffuse lighting using normal/light direction
   - Specular lighting using view/reflection vectors
   - Combined with existing ambient term

```glsl


const meshFS = `
    // ...existing code...
    
    // Diffuse component
    diff = max(dot(normal, lightdir), 0.0);

    // Specular component
    vec3 viewDir = normalize(-fragPos);
    vec3 reflectDir = reflect(-lightdir, normal);
    spec = pow(max(dot(viewDir, reflectDir), 0.0), phongExp);
    
    // ...existing code...
`;
```

### Task 3: Adding Mars
1. **Purpose**: Add Mars as child of Sun in scene graph
2. **Requirements**:
   - Child of Sun
   - Uses sphere mesh
   - -6 units X translation
   - 0.35 uniform scale
   - Mars texture

```javascript


// Create Mars mesh drawer
let marsMeshDrawer = new MeshDrawer(gl, prog);
marsMeshDrawer.setMesh(sphereBuffers.positionBuffer, 
                       sphereBuffers.texCoordBuffer, 
                       sphereBuffers.normalBuffer);

// Set Mars texture
setTextureImg(marsMeshDrawer, "https://i.imgur.com/Mwsa16j.jpeg");

// Create and configure Mars TRS
let marsTrs = new TRS();
marsTrs.setTranslation(-6.0, 0, 0);
marsTrs.setScale(0.35, 0.35, 0.35);

// Create Mars node
let marsNode = new SceneNode(marsMeshDrawer, marsTrs, sunNode);
```
