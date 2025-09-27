"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findComponentInParents = exports.findComponentInChildren = exports.isDescendantOf = exports.findSceneObjectByName = void 0;
/**
 * Searches for a SceneObject with the given name in the tree rooted at the given root SceneObject.
 *
 * @param root - The root SceneObject of the tree to search.
 * @param name - The name of the SceneObject to search for.
 * @returns The first SceneObject with the given name if it exists in the tree, or undefined otherwise.
 */
function findSceneObjectByName(root, name) {
    if (root === null) {
        const rootObjectCount = global.scene.getRootObjectsCount();
        let current = 0;
        while (current < rootObjectCount) {
            const result = findSceneObjectByName(global.scene.getRootObject(current), name);
            if (result) {
                return result;
            }
            current += 1;
        }
    }
    else {
        if (root.name === name) {
            return root;
        }
        for (let i = 0; i < root.getChildrenCount(); i++) {
            const child = root.getChild(i);
            const result = findSceneObjectByName(child, name);
            if (result) {
                return result;
            }
        }
    }
    return null;
}
exports.findSceneObjectByName = findSceneObjectByName;
/**
 * Checks if a {@link SceneObject} is a descendant of another.
 * @param sceneObject - the potential descendant.
 * @param root - the potential ascendant.
 * @returns true, if sceneObject is a descendant of root,
 * otherwise, returns false.
 */
function isDescendantOf(sceneObject, root) {
    if (sceneObject === root) {
        return true;
    }
    const parent = sceneObject.getParent();
    if (parent === null) {
        return false;
    }
    return isDescendantOf(parent, root);
}
exports.isDescendantOf = isDescendantOf;
/**
 * Recursively searches for a component in the children of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose children to search.
 * @param componentType - The type of component to search for.
 * @param maxDepth - Maximum search depth (default: 6).
 * @param currentDepth - Current search depth (default: 0).
 * @returns The first component found, or null if none exists.
 */
function findComponentInChildren(sceneObject, componentType, maxDepth = 6, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
        return null;
    }
    const childrenCount = sceneObject.getChildrenCount();
    for (let i = 0; i < childrenCount; i++) {
        const child = sceneObject.getChild(i);
        const childComponent = child.getComponent(componentType);
        if (childComponent) {
            return childComponent;
        }
        const descendantComponent = findComponentInChildren(child, componentType, maxDepth, currentDepth + 1);
        if (descendantComponent) {
            return descendantComponent;
        }
    }
    return null;
}
exports.findComponentInChildren = findComponentInChildren;
/**
 * Searches for a component in the parent hierarchy of the given SceneObject.
 *
 * @param sceneObject - The SceneObject whose parents to search.
 * @param componentType - The type of component to search for.
 * @param maxLevels - Maximum number of parent levels to search (default: 3).
 * @returns The first component found, or null if none exists.
 */
function findComponentInParents(sceneObject, componentType, maxLevels = 3) {
    let parent = sceneObject.getParent();
    let levelsSearched = 0;
    while (parent !== null && levelsSearched < maxLevels) {
        const parentComponent = parent.getComponent(componentType);
        if (parentComponent) {
            return parentComponent;
        }
        parent = parent.getParent();
        levelsSearched++;
    }
    return null;
}
exports.findComponentInParents = findComponentInParents;
//# sourceMappingURL=SceneObjectUtils.js.map