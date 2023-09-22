/**
 * @file gpbxmlparser.js
 */

(function(_global) {

class GPBXMLParser {
    constructor() {

    }

/**
 * 
 * @param {HTMLElement} innode 
 * @returns 
 */
    parseRefTable(innode) {
        const ret = {
            references: []
        };
        for (const refnode of innode.children) {
            const ref = {};
            console.log('reference', refnode);
            for (const node of refnode.children) {
                const name = node.nodeName.toLowerCase();
                ref[name] = node.textContent;
            }
            ret.references.push(ref);
        }
        return ret;
    }

/**
 * 
 * @param {HTMLElement}
 * @returns 
 */
    parseMesh(node) {
        const ret = {};
        return ret;
    }

/**
 * 
 * @param {HTMLElement} node 
 */
    parseNode(node) {

    }

/**
 * 
 * @param {HTMLElement} node 
 * @returns 
 */
    parseScene(node) {
        const ret = {};
        return ret;
    }

/**
 * 
 * @param {HTMLElement} node 
 * @returns 
 */
    parseAnimations(node) {
        const ret = {};
        return ret;
    }

/**
 * xml の内容
 * @param {string} xmltext 
 */
    parse(xmltext) {
        const el = document.createElement('div');
        el.innerHTML = xmltext;
        let root = null;
        for (const node of el.children) {
            const type = node.nodeName.toLowerCase();
            if (type === 'root') {
                root = node;
                break;
            }
        }
        if (!root) {
            return;
        }

        let reftable = null;
        let meshes = [];
        let scene = null;
        let anims = null;
        for (const node of root.children) {
            const type = node.nodeName.toLowerCase();
            switch(type) {
            case 'reftable':
                {
                    const result = this.parseRefTable(node);
                    reftable = result;
                    console.log('reftable', reftable);
                }
                break;
            case 'mesh':
                {
                    const result = this.parseMesh(node);
                    meshes.push(node)
                };
                break;
            case 'scene':
                {
                    const result = this.parseScene(node);
                    scene = node;
                }
                break;
            case 'animations':
                {
                    const result = this.parseAnimations(node);
                    anims = node;
                }
                break;
            }
            console.log(node);
        }

    }
}

globalThis.GPBXMLParser = GPBXMLParser;

})(globalThis);



