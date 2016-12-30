import Murmur from "./murmur.core"
import MurmurField from "./murmur.field"
import * as tools from "./murmur.tool"
import { MurmurFieldType, MurmurRegexType, MurmurDirectiveTypes, MurmurDirectiveTypesMap, MurmurConnectTypes } from "./murmur.type"
import * as MurmurDirectives from "./murmur.directive"
import Connect from "./murmur.connect"

class MurmurCreator {
    private extractValueRegexr: RegExp = /\{:{0,1}\w+\}/g
    create(murmur: Murmur, model): Connect {
        let connect;
        if (murmur.nodeName === MurmurRegexType.TEXTNODE) {
            connect = new Connect(this.createTextNode(murmur, model), MurmurConnectTypes[0])
        } else {
            let dom: Node | HTMLElement = document.createElement(murmur.nodeName);
            let compiledDom = this.checkMMDirective(model, murmur, dom);
            if (compiledDom) {
                connect = new Connect(compiledDom, MurmurConnectTypes[1])
            } else {
                this.attachAttr(<HTMLElement>dom, model, murmur);
                this.appendChildren(<HTMLElement>dom, model, murmur);
                connect = new Connect(dom, MurmurConnectTypes[0])
            }
        }
        return connect;
    }
    checkMMDirective(model, murmur: Murmur, domGenerated: Node): Node {
        let fragment: Node = document.createDocumentFragment();
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name == 'mm-repeat' && murmur.$repeatDirective.$repeatEntrance) {
                let directive = new MurmurDirectives[MurmurDirectiveTypesMap[name].directive](value);
                murmur.$directives.push(directive);
                murmur.$repeatDirective.repeatDInstance = directive;
                return directive.compile(model, murmur, domGenerated)
            }
        }
        for (let attr of murmur.attr) {
            let {name, value} = attr;
            if (name !== "mm-repeat" && MurmurDirectiveTypesMap[name]) {
                let directive: MurmurDirectives.MurmurDirectiveItf = new MurmurDirectives[MurmurDirectiveTypesMap[name].directive](value);
                murmur.$directives.push(directive);
                directive.compile(model, murmur, domGenerated)
            }
        }
        return null
    }
    attachAttr(dom: HTMLElement, model, murmur: Murmur): void {
        for (let a of murmur.attr) {
            let htmlAttr = document.createAttribute(a.name);
            htmlAttr.value = this.evalExpression(a.value, model, murmur, htmlAttr, MurmurFieldType.ATTR);
            dom.setAttributeNode(htmlAttr);
        }
    }
    appendChildren(parent: HTMLElement, model, murmur: Murmur): void {
        for (let child of murmur.children) {
            child = <Murmur>child;
            child.$repeatDirective.repeatModel = murmur.$repeatDirective.repeatModel
            parent.appendChild(child.create(model))
        }
    }
    createTextNode(murmur: Murmur, model) {
        let onlyChild = murmur.children[0];
        let textNode;
        try {
            if (tools.isSimpleValue(onlyChild)) {
                textNode = document.createTextNode('');
                this.evalExpression(<string>onlyChild, model, murmur)
            } else {
                throw new TypeError()
            }
        } catch (err) {
            console.error(err)
            textNode = document.createTextNode('')
        } finally {
            return textNode
        }

    }
    evalExpression(val: string, model, murmur: Murmur, attr = null, fieldType: string = MurmurFieldType.TEXT): string {
        let copyVal=val;
        if (!tools.isNothing(val)) {
            let matches = val.match(this.extractValueRegexr);
            if (matches) {
                for (let m of matches) {
                    let key = tools.removeBraceOfValue(m);
                    let value = murmur.extract(key);
                    murmur._fields[key] = new MurmurField(value, fieldType, attr)
                    copyVal = copyVal.replace(m, value);
                }
            }
        }
        return copyVal
    }
}


let MurmurCreatorFactory: () => MurmurCreator = (function () {
    let creatorInstance;
    return function () {
        return creatorInstance || (creatorInstance = new MurmurCreator())
    }
})()

export default MurmurCreatorFactory