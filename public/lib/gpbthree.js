/**
 * @file gpbthree.js
 */
// need threejs
// threejs が必要

(function(_global) {

const log = {
    log: console.log.bind(null),
};

/**
 * threejs モデルを生成する
 */
class Maker extends _global.GPB.GPBParser {
/**
 * コンストラクター
 */
    constructor() {
    }

/**
 * 
 * @returns {Object}
 */
    makeModel() {
        const gr = { userData: {} };
        gr.userData.gpbscene = {};
        gr.userData.anims = [];
        {

            const model = {
                chunks: [],
                meshes: [],
            };

            let c = 0;
            { // マテリアル

            }

            { // ヘッダーとチャンク
                this.cur = 11;

                const chunkNum = this.r32s(p, 1)[0];
                log.log('chunkNum', chunkNum);
                for (let i = 0; i < chunkNum; ++i) {
                    const obj = {
                        name: this.rs(p),
                        type: this.r32s(p, 1)[0],
                        offset: this.r32s(p, 1)[0],
                    };
                    model.chunks.push(obj);
                }
            }
            { // メッシュ
                const meshNum = this.r32s(p, 1)[0];
                log.log('meshNum', meshNum);

                for (let i = 0; i < meshNum; ++i) {
/**
 * オブジェクト
 */
                    const mesh = {
                        attrs: [],

                        geo: new THREE.BufferGeometry(),
                        mtl: new THREE.MeshStandardMaterial(),            
                    };
                    model.meshes.push(mesh);

                    const anum = this.r32s(p, 1)[0];
                    let sum = 0;
                    for (let j = 0; j < anum; ++j) {
                        const ns = this.r32s(p, 2);
                        const at = {
                            usage: ns[0],
                            size: ns[1],
                            threeattr: this.usagetoattrname[ns[0]],
                        };
                        mesh.attrs.push(at);

                        sum += at.size;
                    }
                    log.log('attr数', anum, sum);

                    const vtxbyte = this.r32s(p, 1)[0];
                    const vtxnum = vtxbyte / (sum * 4);
                    if (true) {
                        for (let k = 0; k < anum; ++k) {
                            const at = mesh.attrs[k];
                            at.buf = new Float32Array(at.size * vtxnum);
                        }

                        for (let j = 0; j < vtxnum; ++j) {
                            const vtx = this.rfs(p, sum);
                            let offset = 0;

                            for (let k = 0; k < anum; ++k) {
                                const at = mesh.attrs[k];

                                const num = at.size;
                                for (let l = 0; l < num; ++l) {
                                    at.buf[j * num + l] = vtx[offset];
                                    offset ++;
                                }
                            }
                        }
                        log.log('vtxnum', vtxnum);

                        for (let k = 0; k < anum; ++k) {
                            const at = mesh.attrs[k];
                            mesh.geo.setAttribute(at.threeattr, new THREE.BufferAttribute(at.buf, at.size));
                        }

                    } else {
                        this.cur += vtxbyte; // 読まずにスキップする場合
                    }

// 範囲と半径
                    const ranges = this.rfs(p, 10);
//                    log.log('ranges', ranges);
                    {
                        log.log('最小', [ranges[0], ranges[1], ranges[2]]);
                        log.log('最大', [ranges[3], ranges[4], ranges[5]]);
                        log.log('中心', [ranges[6], ranges[7], ranges[8]]);
                        log.log('半径', ranges[9]);
                    }

                    log.log('partnum pos', -1);

                    const partnum = this.r32s(p, 1)[0];
                    log.log('partnum', partnum);

                    for (let j = 0; j < partnum; ++j) {
                        const fiattr = this.r32s(p, 3);
                        log.log('0x', fiattr[0].toString(16), fiattr[1].toString(16));

                        let fis = [];
                        if (fiattr[1] === this.GL_UNSIGNED_SHORT) {
                            fis = this.r16s(p, fiattr[2] / 2);
                            log.log('fis16', fis);
                        } else {
                            fis = this.r32s(p, fiattr[2] / 4);
                            log.log('fis32', fis);
                        }
                        mesh.geo.setIndex(new THREE.BufferAttribute(fis, 1));

                        const indexmax = Math.max(...fis);
                        log.log('indexmax', indexmax); // 範囲チェック向け
                    }

                    //gr.add(mesh.mesh); // TODO: 違う方法で追加すること
                }
            }
            const blockNum = this.r32s(p, 1)[0];
            this.dumpPos('blockNum 後 シーン前', blockNum);
            { // シーン
                gr.userData.gpbscene.nodes = [];

                const cnum = this.r32s(p, 1)[0];
                for (let i = 0; i < cnum; ++i) {
                    const node = this.readNode(p);

                    gr.userData.gpbscene.nodes.push(node);
                }

                const cameraName = this.rs(p);
                const acs = this.rfs(p, 3);

                gr.userData.gpbscene.cameraName = cameraName;
                gr.userData.gpbscene.ambientColors = acs;
            }
            this.dumpPos('シーン終了anim前');

            if (blockNum >= 2) { // アニメ
                log.log('animation chunk');

                const numanim = this.r32s(p, 1)[0];
                for (let i = 0; i < numanim; ++i) {
                    const obj = {};
                    gr.userData.anims.push(obj);

                    const name = this.rs(p);
                    obj.name = name;
                    obj.targets = [];

                    const num = this.r32s(p, 1)[0];
                    for (let j = 0; j < num; ++j) {
                        const targetobj = {};
                        obj.targets.push(targetobj);

                        targetobj.targetname = this.rs(p);

                        targetobj.attr = this.r32s(p, 1)[0];
                        const numtime = this.r32s(p, 1)[0];
                        targetobj.times = this.r32s(p, numtime);
                        //console.log('targetname', targetobj.targetname);

                        const valnum = this.r32s(p, 1)[0];
                        const vals = this.rfs(p, valnum);
                        targetobj.vals = vals;
                        targetobj.keys = [];
                        if (targetobj.attr === 17) {
                            const minnum = Math.min(numtime, Math.floor(valnum / 10));
                            let ft = 0;
                            for (let k = 0; k < minnum; ++k) {
                                const pqs = {
                                    time: targetobj.times[k],
                                    scale: [vals[ft], vals[ft+1], vals[ft+2]],
                                    q: [vals[ft+3], vals[ft+4], vals[ft+5], vals[ft+6]],
                                    p: [vals[ft+7], vals[ft+8], vals[ft+9]],
                                };
                                ft += 10;
                                targetobj.keys.push(pqs);
                            }
                        }
                    }
                }
            }

            console.log('ファイル最終位置', this.cur, '/', p.byteLength);

            log.log('model', model);
        }
        return gr;
    }

}

_global.GPB = _global.GPB || {};
_global.GPB.Maker = Maker;

} )(globalThis);


