// aici generam tabla de sah 
// 8 randuri a cate 8 patratele , una alba una neagra
function generamTablaDeSah(){
    let culoareInitiala  = true;
    let arCuRandurileDeSah = [];
    //un rand va fi un array de obiecte
    // un obiect va fi o patratica 
    
    for(let i = 1; i<=8 ; i++){ //  pentru fiecare rand de la 1 la 8 
        let culoarePrimaCasuta = culoareInitiala;
        let culoare = culoarePrimaCasuta;
        arCuRandurileDeSah.push([]);
        for(let j = 1; j<=8 ; j++){
            let obiect = {culoare: culoare, numar : j}
            // adaugam piese
            if(i === 2){obiect.piesa = 'pion_alb'; obiect.miscari = 0; obiect.pozitie = 'crescator'; obiect.forma = "♙"}
            if(i === 7){obiect.piesa = 'pion_negru'; obiect.miscari = 0; obiect.pozitie = 'descrescator'; obiect.forma = "♟"}

            if((i === 1 && j === 1) || (i === 1 && j === 8)){obiect.piesa = 'tura_alb'; obiect.forma = '♖'}
            if((i === 8 && j === 1) || (i === 8 && j === 8)){obiect.piesa = 'tura_negru'; obiect.forma = '♜'}
            
            if((i === 1 && j === 2) || (i === 1 && j === 7)){obiect.piesa = 'cal_alb'; obiect.forma = '♘'}
            if((i === 8 && j === 2) || (i === 8 && j === 7)){obiect.piesa = 'cal_negru'; obiect.forma = "♞"}

            if((i === 1 && j === 3) || (i === 1 && j === 6)){obiect.piesa = 'nebun_alb'; obiect.forma = '♗'}
            if((i === 8 && j === 3) || (i === 8 && j === 6)){obiect.piesa = 'nebun_negru'; obiect.forma = '♝'}

            if(i === 1 && j === 4 ){obiect.piesa = 'regina_alb'; obiect.forma = '♕'}
            if(i === 8 && j === 4 ){obiect.piesa = 'regina_negru'; obiect.forma = '♛'}

            if(i === 1 && j === 5 ){obiect.piesa = 'rege_alb'; obiect.forma = '♔'}
            if(i === 8 && j === 5 ){obiect.piesa = 'rege_negru'; obiect.forma = '♚'}
            //
            culoare = !culoare
            obiect.rand = i
            arCuRandurileDeSah[i - 1].push(obiect)
            
        }
        culoareInitiala = !culoareInitiala;
    }
    return arCuRandurileDeSah;
}

export {generamTablaDeSah};