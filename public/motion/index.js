/**
 * @file index.js
 */

class Misc {
    async init() {
        console.log('init');

        this.addHandler();
        
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

/**
 * 
 * @param {File} file 
 */
    async parseXML(file) {
        const text = await file.text();
        const parser = new GPBXMLParser();
        const result = await parser.parse(text);
    }

    addHandler() {
        {
/**
 * @type {HTMLElement}
 */
            const el = window.idmain;
            el?.addEventListener('dragover', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                ev.dataTransfer.dropEffect = 'copy';
            });
            el?.addEventListener('drop', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                ev.dataTransfer.dropEffect = 'copy';

                this.parseXML(ev.dataTransfer.files[0]);
            });
        }
        {
/**
 * @type {HTMLElement}
 */
            const el = window.idsub;
            el?.addEventListener('dragover', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                ev.dataTransfer.dropEffect = 'copy';
            });
            el?.addEventListener('drop', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                ev.dataTransfer.dropEffect = 'copy';


            });
        }
    }

}

const misc = new Misc();
misc.init();



