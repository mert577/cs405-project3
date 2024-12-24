/**
 * @class SceneNode
 * @desc A SceneNode is a node in the scene graph.
 * @property {MeshDrawer} meshDrawer - The MeshDrawer object to draw
 * @property {TRS} trs - The TRS object to transform the MeshDrawer
 * @property {SceneNode} parent - The parent node
 * @property {Array} children - The children nodes
 */

class SceneNode {
    constructor(meshDrawer, trs, parent = null) {
        this.meshDrawer = meshDrawer;
        this.trs = trs;
        this.parent = parent;
        this.children = [];

        if (parent) {
            this.parent.__addChild(this);
        }
    }

    __addChild(node) {
        this.children.push(node);
    }

    draw(mvp, modelView, normalMatrix, modelMatrix) {
        /**
         * @Task1 : Implement the draw function for the SceneNode class.
         */

        let transformationMatrix = this.trs.getTransformationMatrix();

        // Transform all matrices by multiplying with the transformation matrix
        let transformedMvp = MatrixMult(mvp, transformationMatrix);
        let transformedModelView = MatrixMult(modelView, transformationMatrix);
        let transformedModel = MatrixMult(modelMatrix, transformationMatrix);

        // For normal matrix, we need to handle it specially (inverse transpose)
        let transformedNormals = MatrixMult(normalMatrix, transpose(inverse(transformationMatrix)));

        // Draw the current node's mesh if it exists
        if (this.meshDrawer) {
            this.meshDrawer.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
        }

        // Recursively draw all children with the transformed matrices
        for (let child of this.children) {
            child.draw(transformedMvp, transformedModelView, transformedNormals, transformedModel);
        }
    }



}