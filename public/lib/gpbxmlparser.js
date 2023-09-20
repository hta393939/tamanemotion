/**
 * @file gpbxmlparser.js
 */

(function(_global) {

class GPBXMLParser {
    constructor() {

    }

/**
 * xml の内容
 * @param {string} xmltext 
 */
    parse(xmltext) {
        const el = document.createElement('div');
        el.innerHTML = xmltext;
        const root = el.children.find(node => {
            const type = node.nodeType.toLowerCase();
            return (type === 'root');
        });
        if (!root) {
            return;
        }

        let reftable = null;
        let meshes = [];
        let scene = null;
        let anims = null;
        for (const node of root.children) {
            const type = node.nodeType.toLowerCase();
            switch(type) {
            case 'reftable':
                reftable = node;
                break;
            case 'mesh':
                meshes.push(node);
                break;
            case 'scene':
                scene = node;
                break;
            case 'animations':
                anims = node;
                break;
            }
            console.log(node);
        }

    }
}

globalThis.GPBXMLParser = GPBXMLParser;

})(globalThis);



