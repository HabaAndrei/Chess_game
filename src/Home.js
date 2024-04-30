import React from 'react'
import {generamTablaDeSah} from './diverse.js';
import { useState, useEffect } from 'react';
import { styleDoiJS } from "./stylinguri.js";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';



const Home = () => {

    const [piesaSelectata, setPiesaSelectata] = useState('');
    const [tablaDeSah, setTablaDeSah] = useState(generamTablaDeSah());
    const [capturileJucatorilor, setCapturileJucatorilor] = useState({alb: [], negru: []});
    const [modalDeschis, setModalDeschis] = useState(false)
    const [pieseScoase, setPieseScoase] = useState([]);
    const [jucatorCareMuta, setJucatorCareMuta] = useState(true);
    const [alerta, setAlerta] = useState({alerta: false, metoda: '', mesaj: ''})

    function facemAlerta(alerta, metoda, mesaj){
        setAlerta({alerta:alerta, metoda:metoda, mesaj:mesaj });

        setTimeout(()=>{setAlerta({alerta:false, metoda:'', mesaj:''})}, 1500)
    }

    function verificareMutarePion(pozitiaViitoare){
        // verific daca pionul este alb sau negru
        if(piesaSelectata.piesa.includes('_alb')){
            // pionul e alb
            // daca merge doua patratele si nu e prima misacre returnez fals;
            if(piesaSelectata.miscari > 0 && (pozitiaViitoare.rand -  piesaSelectata.rand) > 1){facemAlerta(true, 'warning' ,'nu ai voie sa mai faci 2 pozitii'); return false;}
            
            if(((piesaSelectata.numar !== pozitiaViitoare.numar) && (piesaSelectata.rand +1 < pozitiaViitoare.rand))||
            (piesaSelectata.rand +2 < pozitiaViitoare.rand)){facemAlerta(true, 'warning', 'nu poti face aceasta miscare');return false;}
            //pionul nu are voie sa mearga inapoi
            if((piesaSelectata.rand > pozitiaViitoare.rand) && (piesaSelectata.pozitie === 'crescator')){facemAlerta(true, 'warning', 'nu ai voie sa mergi in spate cu pionul'); return false;}

            // pinul nu are voie sa mearga leteral 
            if(piesaSelectata.rand === pozitiaViitoare.rand ){facemAlerta(true, 'warning', 'nu ai voie sa mergi lateral cu pionul');return false}

            // pinul nu are voie sa mearga oblic decat daca captureaza
            if(piesaSelectata.rand + 1 === pozitiaViitoare.rand && 
                ((piesaSelectata.numar + 1 === pozitiaViitoare.numar) || (piesaSelectata.numar  - 1 === pozitiaViitoare.numar) )
                && 
            !pozitiaViitoare.piesa){facemAlerta(true, 'warning', 'trebuie sa capurezi ca sa mergi acolo'); return false;}
            // refac codul sa mearga stanga drepata in oblic si sa mearga doar doua pozii in fata nu un fel de oblic
            
        }else if(piesaSelectata.piesa.includes('_negru')){
            //pionul e negru 
            // daca merge doua patratele si nu e prima misacre returnez fals;
            if(piesaSelectata.miscari > 0 && ( piesaSelectata.rand - pozitiaViitoare.rand) > 1){facemAlerta(true, 'warning', 'nu ai voie sa mai faci 2 pozitii'); return false;}
            if(((piesaSelectata.numar !== pozitiaViitoare.numar) && (piesaSelectata.rand - 1 > pozitiaViitoare.rand))||
            (piesaSelectata.rand -2 > pozitiaViitoare.rand)
            ){facemAlerta(true, 'warning', 'nu poti face aceasta miscare');return false;}

            // pionul nu are voie sa mearga inapoi
            if((piesaSelectata.rand < pozitiaViitoare.rand) && (piesaSelectata.pozitie === 'descrescator')){facemAlerta(true, 'warning', 'nu ai voie sa mergi in spate cu pionul'); return false;}

            //pionul nu are voie sa mearga lateral 
            if(piesaSelectata.rand === pozitiaViitoare.rand ){facemAlerta(true, 'warning', 'nu ai voie sa mergi lateral cu pionul');return false}

            // pionul are voie sa mearga oblic decat daca capureaza 
            if(piesaSelectata.rand - 1 === pozitiaViitoare.rand && 
                ((piesaSelectata.numar - 1 === pozitiaViitoare.numar )|| piesaSelectata.numar  + 1 === pozitiaViitoare.numar )
                && 
            !pozitiaViitoare.piesa){facemAlerta(true, 'warning', 'trebuie sa capurezi ca sa mergi acolo'); return false;}
        }
        return true;
    }


    function verificareMutareTura(pozitiaViitoare){        
        // daca nu merge in sus jos sau dreapta stanga , returnez fals;
        if( !(pozitiaViitoare.numar === piesaSelectata.numar)  &&
            !(pozitiaViitoare.rand === piesaSelectata.rand)
        ){
            if(piesaSelectata.piesa.includes('tura'))facemAlerta(true, 'warning', 'Poti merge doar sus / jos sau dreapta / stanga '); 
            return false;
        }


        // tura nu are voie sa treaca peste nicio piesa
        let treceGresit = false;
        if(pozitiaViitoare.numar !== piesaSelectata.numar){
            // merge pe orizontala
            let max = Math.max(pozitiaViitoare.numar - 1, piesaSelectata.numar - 1); let min = Math.min(piesaSelectata.numar, pozitiaViitoare.numar)
            let arDeVerificat = tablaDeSah[pozitiaViitoare.rand - 1].slice(min, max);
            arDeVerificat.forEach((obiect)=>{
                if(obiect.piesa){
                    if(piesaSelectata.piesa.includes('tura'))facemAlerta(true, 'warning', 'nu ai voie sa treci peste piese');
                    treceGresit=true;
                    return;
                };
            })
            if(treceGresit)return false;
        }else if(pozitiaViitoare.rand !== piesaSelectata.rand){
            // merge pe verticala
            let max = Math.max(pozitiaViitoare.rand - 1, piesaSelectata.rand - 1); let min = Math.min(pozitiaViitoare.rand - 1, piesaSelectata.rand - 1);
            let arDeVerificat = tablaDeSah.slice(min + 1, max);
            arDeVerificat.forEach((ar)=>{
                if(ar[pozitiaViitoare.numar - 1].piesa){
                    if(piesaSelectata.piesa.includes('tura'))facemAlerta(true, 'warning', 'nu ai voie sa treci peste piese');
                    treceGresit=true;
                    return;
                }
            })
            if(treceGresit)return false;
        }

        return true;
    }

    function verificareMutareCal(pozitiaViitoare){
        // verific miscarea sa fie corecta 
        // merge calul in orizondal drepta
        if(
            !(piesaSelectata.numar + 2 === pozitiaViitoare.numar && (piesaSelectata.rand + 1 === pozitiaViitoare.rand || piesaSelectata.rand - 1 === pozitiaViitoare.rand)) &&
            // merge calul in orizonal stanga
           !(piesaSelectata.numar - 2 === pozitiaViitoare.numar && (piesaSelectata.rand + 1 === pozitiaViitoare.rand || piesaSelectata.rand - 1 === pozitiaViitoare.rand)) &&
            // merge calul in vertical jos 
           !(piesaSelectata.rand + 2 === pozitiaViitoare.rand && (piesaSelectata.numar + 1 === pozitiaViitoare.numar || piesaSelectata.numar - 1 === pozitiaViitoare.numar)) &&
            // merge calul in vertical sus
           !(piesaSelectata.rand - 2 === pozitiaViitoare.rand && (piesaSelectata.numar + 1 === pozitiaViitoare.numar || piesaSelectata.numar - 1 === pozitiaViitoare.numar)) 
        ){
            facemAlerta(true, 'warning', 'nu ai facut bine miscarea calului');return false;
        }
        return true;
    }

    function verificareMutareDiagonala(pozitiaViitoare){

        //verificam daca are un traseu corect
        let max = Math.max(pozitiaViitoare.rand - 1, piesaSelectata.rand - 1); let min = Math.min(pozitiaViitoare.rand - 1, piesaSelectata.rand - 1);
        let arCuRandurileUndeTrece = tablaDeSah.slice(min , max + 1);
        let obiectulCuRandulMic = [pozitiaViitoare, piesaSelectata].find((obiect)=>{
            return obiect.rand - 1 === min;
        });
        let obiectulCuRandulMare = [pozitiaViitoare, piesaSelectata].find((obiect)=>{
            return obiect.rand - 1 === max;
        })
        // console.log(obiectulCuRndulMic)
        if((piesaSelectata.culoare !== pozitiaViitoare.culoare)){
            if(piesaSelectata.piesa.includes('nebun'))facemAlerta(true, 'warning', 'trebuie sa mergi pe culoare');
            return false;
        }
        // console.log(arCuRandurileUndeTrece)
        if(arCuRandurileUndeTrece.length <= 2){
            // a mers doar o patratica
           
            if( !((piesaSelectata.numar + 1 === pozitiaViitoare.numar) || (piesaSelectata.numar - 1 === pozitiaViitoare.numar))  
              ||!((piesaSelectata.rand + 1 === pozitiaViitoare.rand) || (piesaSelectata.rand - 1 === pozitiaViitoare.rand))   
            ){
                if(piesaSelectata.piesa.includes('nebun'))facemAlerta(true, 'warning', 'nu ai mers bine');
                return false;
            }
        }else{
            // verific sa fie cineva doar in capat
            // sa nu fie cineva pe traseu
            // a mers mai mult de o patratica
            let variantaUnu = true;
            if(piesaSelectata.rand > pozitiaViitoare.rand )variantaUnu = false;
            let numarMic = obiectulCuRandulMic.numar;
            let numarulMare = obiectulCuRandulMare.numar; 
            let numarDeAdunat = numarMic > numarulMare ? -1 : 1; // --- aici
            if(!variantaUnu)numarDeAdunat = numarMic > numarulMare ? 1 : -1;
            let obFinal = {};
            if(!variantaUnu)arCuRandurileUndeTrece.reverse(); // --------aici
            let trecePestePiese = false;
            arCuRandurileUndeTrece.forEach((arRanduri, index)=>{
                if(trecePestePiese)return;
                obFinal = arRanduri[numarMic - 1]; // ----- aici
                if(!variantaUnu)obFinal = arRanduri[numarulMare - 1]; 
                if((index !== 0 && index !== arCuRandurileUndeTrece.length - 1) && obFinal.piesa){
                    trecePestePiese = true;
                }
                if(variantaUnu){numarMic += numarDeAdunat;}else{numarulMare += numarDeAdunat; } // aicii--------------
            })
            if(trecePestePiese){
                if(piesaSelectata.piesa.includes('nebun'))facemAlerta(true, 'warning', 'pe acest traseu am detectat piese');
                return false;
            }
            if(JSON.stringify(obFinal) !== JSON.stringify(pozitiaViitoare)){
                if(piesaSelectata.piesa.includes('nebun'))facemAlerta(true, 'warning', 'traseul tau nu e corect');
                return false;
            } 
        }
        return true;
    }

    function verificMutareRege(pozitiaViitoare){
        // verific daca merge pe diagonala dar doar o patratica
        if((((piesaSelectata.rand + 1 === pozitiaViitoare.rand) || (piesaSelectata.rand - 1 === pozitiaViitoare.rand))
        && ((piesaSelectata.numar + 1 === pozitiaViitoare.numar) || (piesaSelectata.numar - 1 === pozitiaViitoare.numar)) )
         ||
        // verific daca merge sus jos stanga dreapta doar o patratica
         ((piesaSelectata.rand + 1 === pozitiaViitoare.rand && piesaSelectata.numar === pozitiaViitoare.numar)
        || (piesaSelectata.rand - 1 === pozitiaViitoare.rand && piesaSelectata.numar === pozitiaViitoare.numar)
        || (piesaSelectata.numar - 1 === pozitiaViitoare.numar && piesaSelectata.rand === pozitiaViitoare.rand)
        || (piesaSelectata.numar + 1 === pozitiaViitoare.numar && piesaSelectata.rand === pozitiaViitoare.rand)
        )) return true;
        

        return false;;
    }

    function mutarePiesa(obiect){
        // orice piesa nu are voie sa mearga peste o piesa de a lui
        if((obiect?.piesa?.includes('_alb') && piesaSelectata?.piesa?.includes('_alb')) || 
        obiect?.piesa?.includes('_negru') && piesaSelectata?.piesa?.includes('_negru')){
            facemAlerta(true, 'warning', 'nu ai voie sa aterizezi peste piesa ta ');
            return;
        }

        if(piesaSelectata.piesa?.includes('pion')){
            if(!verificareMutarePion(obiect))return;
        }
        if(piesaSelectata.piesa?.includes('tura')){
            if(!verificareMutareTura(obiect))return;
        }
        if(piesaSelectata.piesa?.includes('cal')){
            if(!verificareMutareCal(obiect))return;
        }
        if(piesaSelectata.piesa?.includes('nebun')){
            if(!verificareMutareDiagonala(obiect))return;
        }
        if(piesaSelectata.piesa?.includes('regina')){
            if(!verificareMutareDiagonala(obiect)&&!verificareMutareTura(obiect)){facemAlerta(true, 'warning', 'nu ai traseul bun cu regina');return};
            // aici mai adaug si functia de la tura pentru ca este exact la fel!!!!!!!!!!!!!
        }
        if(piesaSelectata.piesa.includes('rege')){
            if(!verificMutareRege(obiect)){facemAlerta(true, 'warning', 'nu mergi bine cu regele');return};
        }


        // daca totul este ok , adaug piesa la piese scoase 
        if(obiect?.piesa?.includes('alb')){
            capturileJucatorilor.negru.push({piesa: obiect.piesa, forma: obiect.forma})
        }else if(obiect?.piesa?.includes('negru')){
            capturileJucatorilor.alb.push({piesa: obiect.piesa, forma: obiect.forma})
        }


        // daca regele a fost capturat jucatorul a castigat
        if(obiect.piesa?.includes('rege')){
            if(obiect.piesa.includes('negru')){
                facemAlerta(true, 'success', 'Jucatorul alb a castigat');
            }else{
                facemAlerta(true, 'success', 'Jucatorul negru a castigat');
            }
        }


        // daca totul a mers bine ca si verificare la pion, fac mutarea
        if(piesaSelectata?.piesa?.includes('pion')){
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].piesa = piesaSelectata.piesa;
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].miscari = piesaSelectata.miscari + 1;
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].pozitie = piesaSelectata.pozitie;
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].forma = piesaSelectata.forma;

            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].piesa;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].selectat;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].miscari;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].pozitie;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].forma;

        }

        // daca totul este bine la verificare la tura fac mutarea
        if(piesaSelectata?.piesa?.includes('tura') || piesaSelectata?.piesa?.includes('cal') 
         || piesaSelectata?.piesa?.includes('nebun') || piesaSelectata?.piesa?.includes('regina') || piesaSelectata?.piesa?.includes('rege')){
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].piesa = piesaSelectata.piesa;
            tablaDeSah[obiect.rand - 1][obiect.numar - 1].forma = piesaSelectata.forma;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].piesa;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].selectat;
            delete tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].forma;

        }
        setJucatorCareMuta(!jucatorCareMuta)
        setPiesaSelectata(''); 
    }

    function adaugPieseInLoculPionului(piesaApasata){
        // console.log(piesaApasata, capturileJucatorilor)
        setModalDeschis(true);
        if(piesaApasata.piesa.includes('alb')){
            if(capturileJucatorilor.negru){setModalDeschis(true); setPieseScoase(capturileJucatorilor.negru)}
            // console.log(capturileJucatorilor.negru)
        }else{
            if(capturileJucatorilor.alb){setModalDeschis(true); setPieseScoase(capturileJucatorilor.alb)};
            // console.log(capturileJucatorilor.alb)
        }
    }

    function apasPeJoc(obiect){

        let arMare = capturileJucatorilor.alb.concat(capturileJucatorilor.negru);
        let aCastigat = false
        arMare.forEach((obiect)=>{if(obiect.piesa.includes('rege'))aCastigat = true;})
        if(aCastigat){facemAlerta(true, 'warning', 'partida s-a terminat'); return}

        if(!obiect.piesa && !piesaSelectata)return;

        // daca nu este randul jucatorului ii dau alerta
        if(!piesaSelectata && ((jucatorCareMuta && obiect.piesa.includes('negru')) 
        || (!jucatorCareMuta && obiect.piesa.includes('alb')) )){
            facemAlerta(true, 'warning', 'nu este randul tau sa muti'); return;
        }

        // pionul daca a ajuns in capat poate sa adauge o alta piesa in locul sau 
        if(obiect.piesa?.includes('pion') && 
        ((obiect.piesa?.includes('alb') && obiect.rand === 8 ) || ((obiect.piesa.includes('negru') && obiect.rand === 1)))
        && !obiect?.selectat){
            adaugPieseInLoculPionului(obiect);
        }

        if(obiect.piesa && !piesaSelectata){
            // selectez piesa pe care vreau sa o mut 
            setTablaDeSah((arRand)=>{
                arRand[obiect.rand-1][obiect.numar - 1]['selectat'] = true;
                setPiesaSelectata(obiect);
                return [...arRand];
            })
        } 
        if(piesaSelectata && (piesaSelectata.numar !== obiect.numar || piesaSelectata.rand !== obiect.rand)){
            // mut piesa in casuta
            mutarePiesa(obiect);
        }
        if(piesaSelectata && (piesaSelectata.numar === obiect.numar && piesaSelectata.rand === obiect.rand)){
            // deselectez
            delete tablaDeSah[obiect.rand-1][obiect.numar - 1].selectat;
            setPiesaSelectata('');  
        }

    }

    function adaugamPiesaPeTabla(piesaDeAdaugat){
       
        const piesaDeScosDinTabla = {...piesaSelectata};
        tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].piesa = piesaDeAdaugat.piesa;
        tablaDeSah[piesaSelectata.rand - 1][piesaSelectata.numar - 1].forma = piesaDeAdaugat.forma;
        let culoare = '';
        if(piesaDeAdaugat.piesa.includes('negru'))culoare = 'alb'
        else culoare = 'negru'
        let index = capturileJucatorilor[`${culoare}`].findIndex((ob)=>{
            return ob.piesa === piesaDeAdaugat.piesa;
        })
        capturileJucatorilor[`${culoare}`][index].piesa = piesaDeScosDinTabla.piesa;
        capturileJucatorilor[`${culoare}`][index].forma = piesaDeScosDinTabla.forma;
        setModalDeschis(false);

        //deselectez
        delete tablaDeSah[piesaSelectata.rand-1][piesaSelectata.numar - 1].selectat;
        setPiesaSelectata('');  
        setJucatorCareMuta(!jucatorCareMuta);

    }


   
    return (
    <div className='toataPagina'  >

        {alerta.alerta ? 
        <div className='alertaInPagina' >
            <Alert severity={alerta.metoda}>{alerta.mesaj}</Alert>
        </div> : <div></div>
        }

        <div className='parteaUnu' >
            <Button  variant="outlined" onClick={()=>{window.document.location.reload()}} type="button" className="btn btn-secondary" >Reîncepe jocul
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                </svg>
            </Button>
        </div>


        <div className='parteaDoi'  >

            <p>Este randul jucatorului de culoare {jucatorCareMuta ? 'alba' : 'neagra'}</p>

            <table className='tablaDeSah'  >
                <tbody>
                    {tablaDeSah.map((arCuRanduri, indexRand) =>{ 
                        return  <tr key={indexRand} >
                            {arCuRanduri.map((celula, index) => {
                                return <td 
                                key={index}
                                className={(celula.culoare && !celula.selectat)? 'alb' : 
                                (celula.selectat ? 'verde' : 'negru')
                                }
                                
                                onClick={()=>apasPeJoc(celula)}
                                >{celula.forma}</td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>

            <Modal
            open={modalDeschis}
            onClose={()=>setModalDeschis(!modalDeschis)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
                <Box sx={styleDoiJS}  className='modalDinamic'>
                    
                    {pieseScoase.map((obiect, index)=>{
                        //verifc aici sa nu isi poata aduga pion, adica nici sa nu il arat!
                        if(obiect.piesa.includes('pion'))return;
                        return <p className='piesaDeAdaugat' key={index} onClick={()=>adaugamPiesaPeTabla(obiect)} >{obiect.piesa}{obiect.forma}</p>
                    })}
                    
                
                </Box>
            </Modal>

        </div>

        <div className='parteaTrei' >

            <div className='listaAlb' >
                <h4>Capturile jucatorului alb</h4>
                <ul>
                    {capturileJucatorilor.alb.map((obiect, index)=>{

                        return <li key={index}> {obiect.piesa} {obiect.forma} </li>
                    })}
                </ul>
            </div>

            <div className='listaNegru' >
            <h4>Capturile jucatorului negru</h4>
                <ul>
                    {capturileJucatorilor.negru.map((obiect, index)=>{

                        return <li key={index}> {obiect.piesa} {obiect.forma} </li>
                    })}
                </ul>
            </div>
        </div>

    </div>
    )
}

export default Home


// fac o metoda prin care arat piesele scoase la fiecare jucator, 
// =>>>>> practic sa isi adauge numele la inceput de joc
// cand castiga un jucator, ce se intampla ???????/
// sa dau replay la meci, poate sa adaug ceva in baza de date
// poate sa fac si cu utilizatori
