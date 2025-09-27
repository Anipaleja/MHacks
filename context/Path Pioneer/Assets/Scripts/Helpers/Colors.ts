export namespace Colors{
    let violetColor = new vec4(.56, 0, 1, 1);
    let indigoColor = new vec4(.29, 0, .51, 1);
    let blueColor = new vec4(0, 0, 1, 1);
    let cyanColor = new vec4(0, 1, 1, 1);
    let greenColor = new vec4(0, 1, 0, 1);
    let yellowColor = new vec4(1, 1, 0, 1);
    let orangeColor = new vec4(1, .5, 0, 1);
    let redColor = new vec4(1, 0, 0, 1);
    let magentaColor = new vec4(1, 0, 1, 1);
  
    export function violet(){
        return violetColor;
    }
    export function indigo(){
        return indigoColor;
    }
    export function blue(){
        return blueColor;
    }
    export function cyan(){
        return cyanColor;
    }
    export function green(){
        return greenColor;
    }
    export function yellow(){
        return yellowColor;
    }
    export function orange(){
        return orangeColor;
    }
    export function red(){
        return redColor;
    }
    export function magenta(){
        return magentaColor;
    }

    export function rainbowColor(value: number): vec4 {
        if (value < 0 || value > 1) {
            throw new Error("Input must be between 0 and 1");
        }
        
        // Map value (0 to 1) to hue (0 to 360 degrees in HSL)
        const hue = value * 360;
        
        // Convert HSL to RGB
        function hslToRgb(h: number, s: number, l: number): [number, number, number] {
            s /= 100;
            l /= 100;
            
            const k = (n: number) => (n + h / 30) % 12;
            const a = s * Math.min(l, 1 - l);
            const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
            
            return [f(0), f(8), f(4)];
        }
        
        const [r, g, b] = hslToRgb(hue, 100, 50);
        
        return new vec4(r,g,b,1); // RGBA with alpha 1
    }
}
