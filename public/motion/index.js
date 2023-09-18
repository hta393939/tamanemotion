/**
 * @file index.js
 */

class Misc {
    async init() {
        console.log('init');
        
        const canvas = document.getElementById('maincanvas');
        if (canvas) {
            canvas.width = 640;
            canvas.height = 360;
            const param = {
                canvas,
            };
            const renderer = new Renderer();
            await renderer.init(param);
            requestAnimationFrame(() => {
                renderer.update();
            });
        } else {
            
        }

    }
}

const misc = new Misc();
misc.init();



