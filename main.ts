


export function dummy() {
    console.log("global func dummy");
}

function isloglevel(v) {
    return v == "info" || v == "warn" || 
        v == 'debug' || v == 'error' || v == 'trace';
}
function uilogimpl(...args : any) {
    let idt = ''+ getcallerinfo(2);
    // console.log("idt...", idt);
    // let level = '['+args[0].toUpperCase()+']';
    if (isloglevel(args[0])) {
        let arg0 = args.shift();
        addmylog2(arg0, idt, ...args);
    }else {
        addmylog2(idt, ...args);
    }
}
export function csinfo(...args : any) { uilogimpl("info", ...args); }
export function csdebug(...args : any) { uilogimpl("debug", ...args); }
export function cswarn(...args : any) { uilogimpl("warn", ...args); }
export function cserror(...args : any) { uilogimpl("error", ...args); }


export function addmylog2(...args) {
    // let lst = sss.loglst;
    let arg0 = args[0];
    if (isloglevel(arg0)) {
        // args.shift();
        args[0] = '['+args[0].toUpperCase()+']';
    }else{
        arg0 = '';
    }
    let str = '';
    for (let i = 0; i < args.length; i++) {
        str += args[i] + ' ';
    }
    // let nowt = new Date();
    // str += nowtmstr()

    if (arg0 == 'debug') {
        console.debug(str);
    }else if (arg0 == 'error') {
        console.error(str);
    }else if (arg0 == 'warn') {
        console.warn(str);
    }else { // '' or info
        console.log(str);
    }
 
}


//////////////
// once, or until, or forever
class fnrunner {
    name : string = "noset"
    mode: string = "noset" // once, until, forever, times
    ms : number
    times: number = -1
    f : any
    args: any
    tmer : number
    cnter : number = 0
    btime = new Date()
    
    constructor(name, mode, ms, times, f, ...args) {
        this.name = name;
        this.mode = mode;
        this.f = f;
        this.ms = ms;
        this.times = times;
        this.args = args;
    }
    run() {
        switch (this.mode) {
            case "once":
                this.runonce(); break;
            case "until":
                this.rununtil(); break;
            case "forever":
                this.runforever(); break;
            case "times":
                this.runtimes(); break;
            default:
                console.log("unsupport", this.name, this.mode);
        }
    }
    runonce() {
        this.tmer = setTimeout((me) => {
            this.f(...me.args);
            clearTimeout(me.tmer);
            console.log("runfin", me.dbgstr());
        }, this.ms, this);
    }

    rununtil() {
        this.tmer = setTimeout((me) => {
            me.cnter++;
            let stop = this.f(...me.args);
            if (stop) {
                window.clearTimeout(me.tmer);
                // console.log("runfin", me);
                console.log("runfin", me.dbgstr());
            }else {
                // console.log("rungoon", me.dbgstr());
            }
        }, this.ms, this);
    }
    runforever() {
        this.tmer = setTimeout((me) => {
            me.cnter++;
            this.f(...me.args);
            // clearTimeout(o.tmer);
            // console.log("runok", o.ms, o.args);
        }, this.ms, this);
    }
    runtimes() {
        this.tmer = setTimeout((me) => {
            me.cnter++;
            this.f(...me.args);
            if (me.cnter>me.times) {
                clearTimeout(me.tmer);
                console.log("runfin", me.dbgstr());
            }
        }, this.ms, this);
    }
    dbgstr() {
        let me = this;
        return me.name +' '+ me.mode +' timeo:'+ me.ms +' argc:'+me.args.length;
    }
}
export function runonce(ms, f, ...args) {
    let idt = ''+ getcallerinfo(1);
    // console.log("idt...", idt);
     (new fnrunner(idt, "once", ms, -1, f, ...args)).run();
}
export function rununtil(ms, f, ...args) {
    let idt = ''+getcallerinfo(1);
    // console.log("idt...", idt);
     (new fnrunner(idt,"until", ms, -1, f, ...args)).run();
}
export function runforever(ms, f, ...args) {
    let idt = ''+ getcallerinfo(1);
    // console.log("idt...", idt);
     (new fnrunner(idt,"forever", ms, -1, f, ...args)).run();
}
export function runtimes(ms, times, f, ...args) {
    let idt = ''+ getcallerinfo(1);
    // console.log("idt...", idt);
     (new fnrunner(idt,"times", ms, times, f, ...args)).run();
}
export function randnb(base : number, ext : number) {
    return Math.ceil((Math.random() *1000000) % ext) + base;
}
export function runwait(condfn, f) {
    let ok = condfn();
    if (ok) { f(); }
}
// use in .catch(mylibg.errprt)
export function errprt(err) {
    if (err == null ) return;
    let idt = ''+ getcallerinfo(1);
    console.log(idt, err);
    addmylog2('error', idt, err);
}

/// utils
function tojson(req:any) {
    return JSON.stringify(req);
}
export function nowtmstr() : string {
    let s = (new Date()).toString();
    return '['+s.substring(0,24)+']';
}
export function nowtmstrdft() : string {
    let s = (new Date()).toString();
    return s.substring(0,24);
}
export function nowtmstriso() : string {
    let t = new Date();
    return t.toISOString();
}
export function nowtmstrzh() : string {
    return objtmstrzh(new Date());
}
export function objtmstrzh(dt : Date) : string {
    return dt.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}
// mm:dd hh:II
export function objtmstrmin(dt : Date) : string {
    let s = objtmstrzh(dt);
    return s.substring(5, s.length-3);
}

// = d1-d2
function datesubms(d1: Date, d2: Date) {
    return d1.getMilliseconds() - d2.getMilliseconds();
}
export function empty(v) {
    return v=='' || v == null || v == undefined;
}

// todo, for vue,web
function getcallerinfo(skip:number)  {
    let err = new Error();
    // console.log(err.message, 'xx', err.stack, typeof err.stack);
    let lines = err.stack?.split('\n',99);
    // console.log(lines);
    // return 'hheehh';

    for(let i = 1; i < lines?.length; i++) {
        if (i < skip+1) continue;
        // '    at getcallerinfo (file:///.../src/index.ts:1171:15)'
        //  '    at null.<anonymous> (file:///Users/gzleo/aprog/fedints/src/index.ts:852:13)'
        let re = new RegExp('at ([^ ]+)? \\((file://[^:]+):([^:]+):(.+)\\)');
        let theline = lines[i];
        let mats = re.exec(lines[i]);
        // console.log(mats);
        if (mats == null) {
            // at Object.scheduled (index.js:1139:5)
            re = new RegExp('at ([^ ]+)? \\(([^:]+):([^:]+):(.+)\\)');
            mats = re.exec(lines[i]);
            // console.log('wtffff', lines[i]);
            if(mats!=null){mats[1]='<closure>';}

        }
        if (mats == null) {
            //   at index.js:1445:7
            re = new RegExp('at([^ ]+)? ([^:]+):([^:]+):(.+)');
            mats = re.exec(lines[i]);
            // console.log('wtffff', lines[i]);
            if(mats!=null){mats[1]='<closure>';}

        }
        if (mats == null) {
            re = new RegExp('at([ ]+)(file://[^:]+):([^:]+):(.+)');
            mats = re.exec(lines[i]);
            // console.log('wtffff', lines[i]);
            if(mats!=null){mats[1]='<closure>';}
        }

        // qml
        if (mats == null) {
            re = new RegExp('([^@]+)@(file://[^:]+):(.+)');
            mats = re.exec(lines[i]);
            // console.log('wtffff', lines[i]);
            // if(mats!=null){mats[1]='<closure>';}
            // console.log("qml line", mats);
            let bname = mats[2].split("/").pop();
            return [bname+":"+mats[3], mats[1]];
        }

        // vuejs,web
        if (mats == null) {
            // rununtil@http://localhost:1420/src/mylib.ts?t=1717309257779:133:34
            re = new RegExp('([^@]+)@http(.+)');
            mats = re.exec(lines[i]);
            if (mats != null) {
            
            let uo = new URL('http'+mats[2]);
            // console.log(mats, lines[i], uo);
            //mats[1] = mats[1];
            let theline = uo.pathname.split('/').pop() + ':' + uo.search.split(':')[1];
            return [theline, mats[1]];
            }
            // return [theline, funcname];
        }
        // vuejs,web
        if (mats == null) {
            // http://localhost:1420/src/mylib.ts?t=1717309257779:133:34
            re = new RegExp('http(.+)');
            mats = re.exec(lines[i]);
            if (mats != null) {
                let uo = new URL(mats[0]);
                // console.log(mats, lines[i], uo);
                let theline = uo.pathname.split('/').pop() + ':' + uo.search.split(':')[1];
                return [theline, '<global>'];
            }
        }

        if (mats == null && lines[i].endsWith('[native code]')) {
            // asyncFunctionResume@[native code]
            return [lines[i], ''];
        }

        if (mats != null) {
            let arr = mats[2].split('/');
            arr = arr.splice(arr.length-2);
            // console.log(arr.join('/'));
            let filepath = arr.join('/');
            let funcname = mats[1];
            let linenum = mats[3];
            let resline = filepath + ':' + linenum + ' '+funcname+'():';

            // 这么输出也看不出来，可能只对特定的格式转换
            // for (let j = 0; j < lines[i].length; j++) {
            //     console.log(lines[i][j]);
            // }
            // console.log(theline, 'aaaa');
            // console.log('    at ' + resline);

            return [theline, funcname];
        }else{
            console.log("regex nomatch???", i, theline, lines );
        }
        break;
    }
    
    return ['file?:?', 'func?()'];
    // return 'file?:? func?()';
}



///////////

export class util {
    static dummy() {
        console.log("class static func dummy");
    }
}

export default {
    dummy() {
        console.log("default func dummy");
    }
}