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
            this.renderer = renderer;
            await renderer.init(param);
            this.update();
        } else {
            
        }

    }

    update() {
        if (this.renderer) {
            this.renderer.update();
        }

        requestAnimationFrame(() => {
            this.update();
        });
    }

}

const misc = new Misc();
misc.init();



