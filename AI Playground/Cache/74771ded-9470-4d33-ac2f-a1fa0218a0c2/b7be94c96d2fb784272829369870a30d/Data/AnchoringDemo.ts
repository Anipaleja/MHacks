import { EnhancedSnap3DFactory } from "./EnhancedSnap3DFactory";
import { PositionAnchor } from "./PositionAnchor";

/**
 * Demo script showing how to use the world anchoring system
 */
@component
export class AnchoringDemo extends BaseScriptComponent {
    @input
    @ui.label("Test Prompts")
    @widget(new TextAreaWidget())
    private testPrompts: string = "a red cube\na blue sphere\na green pyramid";
    
    @input
    @ui.label("Enable Demo Mode")
    private enableDemo: boolean = true;
    
    @input
    @ui.label("Auto Generate Objects")
    private autoGenerate: boolean = false;
    
    @input
    enhancedFactory: EnhancedSnap3DFactory;
    
    private promptList: string[] = [];
    private currentIndex: number = 0;
    
    onAwake() {
        if (!this.enableDemo) return;
        
        // Parse the test prompts
        this.promptList = this.testPrompts.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        
        // Set up touch controls
        this.createEvent("TapEvent").bind(() => {
            this.createNextObject();
        });
        
        // Auto generate if enabled
        if (this.autoGenerate && this.promptList.length > 0) {
            let lastCreateTime = 0;
            this.createEvent("UpdateEvent").bind(() => {
                const currentTime = getTime();
                if (currentTime - lastCreateTime > 3.0) {
                    this.createNextObject();
                    lastCreateTime = currentTime;
                }
            });
        }
        
        print("Anchoring Demo initialized! Tap to create anchored objects.");
        print("Objects will stay in place even when you move to different rooms.");
    }
    
    private createNextObject(): void {
        if (!this.enhancedFactory || this.promptList.length === 0) {
            print("No factory or prompts available");
            return;
        }
        
        const prompt = this.promptList[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.promptList.length;
        
        print(`Creating anchored object: ${prompt}`);
        
        this.enhancedFactory.generateAnchoredObject(prompt)
            .then((result) => {
                print(result);
            })
            .catch((error) => {
                print("Error creating object: " + error);
            });
    }
    
    /**
     * Method to manually anchor existing objects
     */
    public anchorAllObjectsInScene(): void {
        const allObjects = this.sceneObject.getParent();
        this.anchorChildObjects(allObjects);
    }
    
    private anchorChildObjects(parent: SceneObject): void {
        for (let i = 0; i < parent.getChildrenCount(); i++) {
            const child = parent.getChild(i);
            
            // Check if this object doesn't already have a PositionAnchor
            if (!child.getComponent(PositionAnchor.getTypeName())) {
                // Add anchoring to objects that look like generated content
                if (child.name.includes("Snap3D") || child.name.includes("Generated")) {
                    const anchor = child.createComponent(PositionAnchor.getTypeName());
                    anchor.anchorOnStart = true;
                    print(`Added anchor to existing object: ${child.name}`);
                }
            }
            
            // Recursively check children
            if (child.getChildrenCount() > 0) {
                this.anchorChildObjects(child);
            }
        }
    }
}