/*
=========================================================
UTILS.JS
---------------------------------------------------------

Funciones auxiliares de la aplicación.

Este módulo NO depende de la interfaz ni de la base de
datos.

Puede reutilizarse tanto en la versión web como en
Capacitor.

=========================================================
*/


/*========================================================
Viento
========================================================*/

export const windOptions = Array.from(
    { length: 31 },
    (_, i) => i.toString()
);

windOptions.push(">30");


/*========================================================
Ola
========================================================*/

export const waveOptions = [

    "sin ola",

    "poca ola",

    "chopy",

    "ola media",

    "ola grande",

    "mar de fondo"

];


export const waveRank = {

    "":0,

    "sin ola":1,

    "poca ola":2,

    "chopy":3,

    "ola media":4,

    "ola grande":5,

    "mar de fondo":6

};



/*========================================================
Ordenar viento
========================================================*/

export function parseWind(value){

    if(!value) return -1;

    if(value===">30") return 31;

    return parseInt(value) || 0;

}



/*========================================================
Generar ID
========================================================*/

export function generateId(){

    return crypto.randomUUID();

}



/*========================================================
Fecha actual
========================================================*/

export function now(){

    return Date.now();

}



/*========================================================
Codificar objeto
========================================================*/

export function encodeShareData(data){

    return "TRIM-" +

        btoa(

            unescape(

                encodeURIComponent(

                    JSON.stringify(data)

                )

            )

        );

}



/*========================================================
Decodificar objeto
========================================================*/

export function decodeShareData(code){

    if(!code.startsWith("TRIM-")){

        throw new Error("Código incorrecto");

    }

    return JSON.parse(

        decodeURIComponent(

            escape(

                atob(

                    code.replace("TRIM-","")

                )

            )

        )

    );

}



/*========================================================
Plantilla mínima
========================================================*/

export function getBaseColumnsTemplate(){

    return [

        {

            id:"viento_desde",

            label:"Viento Desde",

            active:true,

            type:"select",

            options:windOptions

        },

        {

            id:"viento_hasta",

            label:"Viento Hasta",

            active:true,

            type:"select",

            options:windOptions

        },

        {

            id:"ola",

            label:"Ola",

            active:true,

            type:"select",

            options:waveOptions

        }

    ];

}



/*========================================================
Plantilla inicial WASZP
========================================================*/

export function getWaszpTemplate(){

    return [

        ...getBaseColumnsTemplate(),

        {

            id:"hobenques_mm",

            label:"Punto/mm Hobenques",

            active:true,

            type:"number"

        },

        {

            id:"hobenques_tens",

            label:"Tensión Hobenques",

            active:true,

            type:"number"

        },

        {

            id:"stay_tens",

            label:"Tensión Stay",

            active:true,

            type:"number"

        },

        {

            id:"driza",

            label:"Marca Driza",

            active:true,

            type:"number"

        },

        {

            id:"base_palo",

            label:"Posición Base Palo",

            active:true,

            type:"number"

        },

        {

            id:"cunas",

            label:"Cuñas",

            active:true,

            type:"number"

        },

        {

            id:"caida",

            label:"Caída",

            active:true,

            type:"number"

        },

        {

            id:"crucetas",

            label:"Apertura Crucetas",

            active:true,

            type:"number"

        },

        {

            id:"prebend",

            label:"Prebend",

            active:true,

            type:"number"

        }

    ];

}



/*========================================================
Ordenar configuraciones
========================================================*/

export function sortConfigurations(configs){

    return configs.sort((a,b)=>{

        const windA=parseWind(a.viento_desde);

        const windB=parseWind(b.viento_desde);

        if(windA!==windB){

            return windA-windB;

        }

        const hastaA=parseWind(a.viento_hasta);

        const hastaB=parseWind(b.viento_hasta);

        if(hastaA!==hastaB){

            return hastaA-hastaB;

        }

        const waveA=waveRank[a.ola] || 0;

        const waveB=waveRank[b.ola] || 0;

        return waveA-waveB;

    });

}



/*========================================================
Clonar objeto
========================================================*/

export function deepClone(object){

    return structuredClone(object);

}



/*========================================================
Validar texto
========================================================*/

export function isEmpty(value){

    return value===undefined ||

           value===null ||

           value.toString().trim()==="";

}



/*========================================================
Descargar fichero JSON
========================================================*/

export function downloadJSON(data,filename){

    const blob=new Blob(

        [

            JSON.stringify(

                data,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=filename;

    a.click();

    URL.revokeObjectURL(url);

}



/*========================================================
Copiar al portapapeles
========================================================*/

export async function copy(text){

    try{

        await navigator.clipboard.writeText(text);

        return true;

    }

    catch{

        return false;

    }

}