function DiagramKnot() {//this function close the knot and start the questions about intersections. (called automatically when the diagram is closed by user)
    ponto.style.visibility= 'visible';
    document.getElementById("btn_Yes").disabled = false;
    document.getElementById("btn_No").disabled = false;
    newKnot = -1;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(Sx[0],Sy[0]); //connect the first with de last point (to close the knot diagram)
    ctx.stroke();
    //-------------------- starting to find the intersections between the segments
    let Var, Paramt1, num_I, done,  r
    //Var: used to labeled the name of arcs of knot. num_I: indicate the number of intersections
    done = false;
    Paramt1 = [];  //this array store all information for each intersection point
    num_I = 0;
    numpoints=Cy.length;  //get the number of vertices of diagram
    
    Sx.push(Sx[0]);  //to close the diagram, the last point coincide with the firs point
    Sy.push(Sy[0]);
    Cx.push(Cx[0]);
    Cy.push(Cy[0]);

    //...................................................................................................................................................

    for (let i = 0; i < numpoints; i++) {
        a1 = Cx[i];
        b1 = Cy[i];    //cartesian coordinates of A_i-click
        a2 = Cx[i+1];
        b2 = Cy[i+1];  //cartesian coordinates of A_{i+1}-click
        num_I = 0;
        Paramt1 = [];
        done = false;
        for (let j = 0; j < numpoints; j++) {
            if (i != j) {
                // i!=j: intersection of adjacent segments does not matter
                c1 = Cx[j];  //cartesian coordinates of A_j-click
                d1 = Cy[j];
                c2 = Cx[j+1]; //cartesian coordinates of A_{j+1}-click
                d2 = Cy[j+1];
                t1 = (a1*d1-a1*d2-b1*c1+b1*c2+c1*d2-c2*d1)/(a1*d1-a1*d2-a2*d1+a2*d2-b1*c1+b1*c2+b2*c1-b2*c2);
                t2 = -(a1 * b2 - a1 * d1 - a2 * b1 + a2 * d1 + b1 * c1 - b2 * c1) / (a1 * d1 - a1 * d2 - a2 * d1 + a2 * d2 - b1 * c1 + b1 * c2 + b2 * c1 - b2 * c2);

                if ((0 < t1 && t1 < 1) && (0 < t2 && t2 < 1))  {//then there was intersection between the segments
                    done = true;
                    num_I = num_I+1;
                    z1 =  a1+t1*(a2-a1); //local variable of cartes. x-coord. of intersection
                    w1 =  b1+t1*(b2-b1);
                    xa =  z1+xc/2;      //local variabel of screen x-coord. of intersection
                    ya = -w1+yc/2;
                    
                    Paramt1.push([t1, i+1, j+1, z1, w1, xa, ya, a1, b1, a2, b2, c1, d1, c2, d2]); //store all information of each intersection point
                    r = 8;
                    ctx.fillStyle='#ffe4c4';
                    ctx.beginPath();
                    ctx.ellipse(xa,ya, r, r,  Math.PI/4, 0, 2*Math.PI);  //clears a region around the intersection
                    ctx.fill();
                }
              }
            }
        
        for (let i =0; i < (num_I-1); i++){//sorts the Paramt1 list according to the ascending order of the t1 parameters
            for (j = i+1; j < num_I; j++){ //This is important to move through the diagram naturally
                if (Paramt1[j][0] < Paramt1[i][0]){
                    aux = Paramt1[i]
                    Paramt1[i] = Paramt1[j]
                    Paramt1[j] = aux
                }
            }
        }
        
        if (done == true){//VD array carries information only related to intersections
            for (let n =0; n < Paramt1.length; n++){
                VD.push(Paramt1[n]) 
            }
        }
        
    }
    
    //-------------------------------------------------------------------------

    NC = VD.length/2 //NC = number of intersections of the knot diagram
    if (NC == 0){
        disabled_button("btn_Yes", "true")
        disabled_button("btn_No", "true")
        ponto.style.visibility= 'hidden';
        document.getElementById("demo").innerHTML = "Knot determinant: D = 1 <br> Alexander polynomial: p(t) = 1"
    }
    dNC = 2*NC

    //=======================================================================================================================
    q=-1
    for (let i = 0; i < dNC; i++) {//create an array with only the indices that intersected
        for (let k = i; k < dNC; k++) {
            if ((VD[i][2] == VD[k][1]) && (VD[i][1] == VD[k][2])) {//search for vectors v_i with [i,j] permuted, that is, search for the opposite vector
                q = q + 1
                VecIndex_I[q] = VD[i][1] //VecIndex_I = array only with the indices I that intersected
                Index_v.push(i)  // store the indexes  of i-ésima intersection
                Index_op.push(k) // store the indexes  of k-ésima intersection opposite.
            }
        }
    }
    
    //=======================================================================================================================
    for(let i=0; i < dNC; i++){ //Creates a matrix (6 x dNC) filled with zeros
        VecUpDown[i]=[]
        for(let j=0; j < 6; j++){
            VecUpDown[i][j]=0
        }
    }
    //=======================================================================================================================
    //VecUpDown[0] stores the index i of the segment I_i, formed by the points A_i and A_{i+1}
    //VecUpDown[1] stores the index j of the segment I_j, formed by the points A_j and A_{j+1}
    //VecUpDown[2] save index i if I_i passes over I_j and save index j if I_j passes over I_i
    //VecUpDown[3] stores numbers that correspond to variables (arc names), 1--> a, 2-->b, ...of a knot
    //VecUpDown[4] = +1 if the determinant referring to the third coordinate of the vector product, ui= vec(A_iA_{i+1}) with wj=vec(A_iA_j) is positive.
    //             = -1 if the determinant referring to the third coordinate of the vector product, ui= vec(A_iA_{i+1}) with wj=vec(A_iA_j) is negative.
    //             +1 and -1 tell you which arc is to the right or left of the segment that passes over each intersection.

    // VecUpDown[5] stores the position of the opposite vector, useful for obtain the knot matrix.
    //Opposite vector: when traversing the entire knot diagram, we pass through the same intersection twice, 
    //and the information from the second pass is stored in a vector that we call the opposite vector. 
    //***********************************************************************************************
    k=-1
    ponto.style.left = (VD[0][5]-3)+'px';
    ponto.style.top =  (VD[0][6]+3)+'px';
    document.getElementById("WantConnect").textContent = "Would you like to connect vertices " + VD[0][1] + ' and ' + (VD[0][1]+1)+"?";
    
    VD2=[];//vector with information about intersections without repetition
    for (let i = 0; i < dNC; i++) {//create an array with only the indices that intersected
        for (let k = i; k < dNC; k++) {
            if ((VD[i][2] == VD[k][1]) && (VD[i][1] == VD[k][2])) {//search for vectors v_i with [i,j] permuted, that is, search for the opposite vector
                VD2.push(VD[i]);//Create a matrix with intersection data (excluding the repetitions that occur in VD, as in VD we pass through the intersection twice)
            }
        }
    }
    return VD, VD2, VecUpDown, dNC, k, VecIndex_I  
}//End function DiagramKnot
