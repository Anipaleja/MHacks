# World Anchoring System for Snap Spectacles

This system allows 3D objects to stay in fixed world positions instead of following the user around. Objects will remain exactly where you place them, even when you move to different rooms.

## Files Overview

### Core Components

1. **PositionAnchor.ts** - The main anchoring component
2. **EnhancedSnap3DFactory.ts** - Enhanced factory that creates anchored objects
3. **AnchoringDemo.ts** - Demonstration script
4. **WorldAnchor.ts** & **AnchoredSnap3DFactory.ts** - Alternative implementations (more advanced)

## How to Use

### Method 1: Use the Enhanced Factory (Recommended)

1. **Add the EnhancedSnap3DFactory to your scene:**
   - Create an empty SceneObject
   - Add the `EnhancedSnap3DFactory` component
   - Set the `snap3DInteractablePrefab` to your existing Snap3D prefab
   - Enable "Enable World Anchoring"
   - Set your preferred "Placement Distance"

2. **Configure the settings:**
   - `Enable World Anchoring`: Turn on/off the anchoring system
   - `Placement Distance`: How far in front of you objects are placed (in cm)
   - `Run On Tap`: Enable tap-to-create functionality

### Method 2: Add Anchoring to Existing Objects

1. **Add PositionAnchor to any existing object:**
   ```typescript
   const anchor = myObject.createComponent(PositionAnchor.getTypeName());
   anchor.anchorOnStart = true; // Will anchor automatically
   ```

2. **Manual anchoring:**
   ```typescript
   const anchor = myObject.getComponent(PositionAnchor.getTypeName());
   anchor.setAnchorPosition(); // Anchor at current position
   anchor.anchorToForwardPosition(100); // Anchor 100cm in front of camera
   ```

### Method 3: Retrofit Existing Factory

If you want to add anchoring to your existing `Snap3DInteractableFactory`:

1. Import the PositionAnchor:
   ```typescript
   import { PositionAnchor } from "./PositionAnchor";
   ```

2. After creating your object, add the anchor:
   ```typescript
   // After: let outputObj = this.snap3DInteractablePrefab.instantiate(this.sceneObject);
   
   // Add anchoring
   const positionAnchor = outputObj.createComponent(PositionAnchor.getTypeName());
   positionAnchor.anchorOnStart = false;
   positionAnchor.anchorToForwardPosition(80); // or your preferred distance
   ```

## Key Features

### PositionAnchor Component

- **Automatic anchoring**: Set `anchorOnStart = true` to anchor on initialization
- **Forward positioning**: `anchorToForwardPosition(distance)` places objects in front of camera
- **Custom positioning**: `anchorToWorldPosition(position, rotation?)` for specific placement
- **Auto-correction**: Objects snap back if they drift from their anchor point
- **Easy management**: Remove anchors with `removeAnchor()`

### Enhanced Factory Features

- **Toggle anchoring**: Enable/disable world anchoring per object
- **Distance control**: Adjust how far objects are placed
- **Compatible**: Works with existing Snap3D workflows
- **Error handling**: Robust error handling for destroyed objects

## Example Usage

### Creating a Room Gallery

```typescript
// Create objects at specific positions around a room
const positions = [
    new vec3(100, 0, 0),    // Right wall
    new vec3(-100, 0, 0),   // Left wall  
    new vec3(0, 0, 100),    // Back wall
];

const prompts = ["a painting", "a sculpture", "a vase"];

for (let i = 0; i < positions.length; i++) {
    factory.generateAnchoredObject(prompts[i], positions[i]);
}
```

### Anchoring Existing Objects

```typescript
// Find all generated objects and anchor them
const allObjects = scene.getAllSceneObjects();
for (let obj of allObjects) {
    if (obj.name.includes("Snap3D")) {
        const anchor = obj.createComponent(PositionAnchor.getTypeName());
        anchor.setAnchorPosition(); // Anchor at current location
    }
}
```

## Demo Setup

1. Add `AnchoringDemo` component to a scene object
2. Connect the `enhancedFactory` input to your EnhancedSnap3DFactory
3. Set test prompts (one per line)
4. Enable demo mode
5. Tap to create anchored objects

## Technical Notes

- Objects are anchored using world coordinates, not relative to the camera
- The system automatically corrects drift (objects that move >1cm from anchor)
- Anchors survive scene changes and user movement
- Compatible with existing Snap3D workflows and prefabs

## Troubleshooting

**Objects not staying in place:**
- Ensure `PositionAnchor` component is added
- Check that `isAnchored` returns true
- Verify the anchor position is set correctly

**Performance issues:**
- The update() method in PositionAnchor runs every frame
- Consider disabling auto-correction if not needed
- Limit the number of anchored objects in complex scenes

**Objects disappearing:**
- Check that objects aren't being destroyed by other scripts
- Verify the anchor position is within reasonable bounds
- Ensure the parent object hierarchy is stable

## Migration from Original Factory

To upgrade your existing `Snap3DInteractableFactory`:

1. Replace imports: Add `import { PositionAnchor } from "./PositionAnchor";`
2. Add anchoring options to your input variables
3. Create PositionAnchor component after object instantiation
4. Set anchor position before or after 3D model loading

The anchored objects will now stay exactly where you place them, creating a persistent 3D environment that doesn't follow you around!