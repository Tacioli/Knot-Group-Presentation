from js import document, window
import sympy

def KnotGroup_OnClk():
    from js import VecUpDown, VD
    
    # Limpa o texto anterior
    document.getElementById("demo").innerHTML = ""

    NC = len(VD) // 2
    dNC = 2 * NC
    Var = 1

    # Atribuição das variáveis (Arcos)
    for k in range(dNC):
        if VecUpDown[k][0] == VecUpDown[k][2]:
            VecUpDown[k][3] = Var
        if VecUpDown[k][1] == VecUpDown[k][2]:
            Var = Var + 1
            VecUpDown[k][3] = Var
        if Var == NC + 1:
            VecUpDown[k][3] = 1

    geradores = [f"x_{{{i}}}" for i in range(1, NC + 1)]
    relacoes = []

    def get_arc(idx):
        return NC if idx == 0 else idx

    KnotMatrixAux = []
    for i in range(NC):
        KnotMatrixAux.append([0 for j in range(NC)])

    t = sympy.Symbol('t')
    J = sympy.Symbol('J')
    Li = -1

    # Extração das relações (Wirtinger) e Derivadas de Fox
    for i in range(dNC):
        if VecUpDown[i][4] != 0:
            Li += 1
            op = VecUpDown[i][5]

            if VecUpDown[i][0] == VecUpDown[i][2]:
                arco_over = VecUpDown[i][3]
                arco_A = get_arc(VecUpDown[op][3])
                arco_B = get_arc(VecUpDown[op][3] - 1)

                if VecUpDown[i][4] < 0:
                    relacoes.append(f"x_{{{arco_A}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_B}}}")
                    
                    KnotMatrixAux[Li][VecUpDown[i][3] -1] = t-1 + KnotMatrixAux[Li][VecUpDown[i][3] -1]
                    KnotMatrixAux[Li][VecUpDown[op][3]-1] = 1
                    KnotMatrixAux[Li][VecUpDown[op][3]-2] = -t + KnotMatrixAux[Li][VecUpDown[op][3]-2]
                else:
                    relacoes.append(f"x_{{{arco_B}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_A}}}")
                    
                    KnotMatrixAux[Li][VecUpDown[i][3] - 1] = t - 1 + KnotMatrixAux[Li][VecUpDown[i][3] - 1]
                    KnotMatrixAux[Li][VecUpDown[op][3] - 1] = -t + KnotMatrixAux[Li][VecUpDown[op][3] - 1]
                    KnotMatrixAux[Li][VecUpDown[op][3] - 2] = 1

            if VecUpDown[i][1] == VecUpDown[i][2]:
                arco_over = get_arc(VecUpDown[op][3])
                arco_A = VecUpDown[i][3]
                arco_B = get_arc(VecUpDown[i][3] - 1)

                if VecUpDown[i][4] < 0:
                    relacoes.append(f"x_{{{arco_B}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_A}}}")
                    
                    KnotMatrixAux[Li][VecUpDown[i][3] - 1] = -t + KnotMatrixAux[Li][VecUpDown[i][3] - 1]
                    KnotMatrixAux[Li][VecUpDown[i][3] - 2] = 1
                    KnotMatrixAux[Li][VecUpDown[op][3] - 1] = t-1 + KnotMatrixAux[Li][VecUpDown[op][3] - 1]
                else:
                    relacoes.append(f"x_{{{arco_A}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_B}}}")
                    
                    KnotMatrixAux[Li][VecUpDown[i][3] - 1] = 1
                    KnotMatrixAux[Li][VecUpDown[i][3] - 2] = -t + KnotMatrixAux[Li][VecUpDown[i][3] - 2]
                    KnotMatrixAux[Li][VecUpDown[op][3] - 1] = t - 1 + KnotMatrixAux[Li][VecUpDown[op][3] - 1]

    # Redução da Matriz para o Polinômio de Alexander
    KnotMatrix = []
    for i in range(NC-1):
        KnotMatrix.append([0 for j in range(NC-1)])

    for i in range(NC-1):
        for j in range(NC-1):
            KnotMatrix[i][j] = KnotMatrixAux[i][j]

    ma = sympy.Matrix(KnotMatrix)
    p_t = ma.det()
    
    if str(p_t) == 'nan':
        p_t = ma.det(method='lu').simplify()
        p_t = p_t.expand()

    if p_t.subs(t, 1) == -1:
        p_t = -p_t
        
    p1 = (t**J)*p_t
    p2 = p1.subs(t, 1/t)
    p3 = p1-p2
    
    det_val = 1
    poly_val = 1
    
    if p_t != 1:
        i = 1
        while True:
            p4 = (p3.subs(J, -i)).simplify()
            if p4 == 0:
                P = p1.subs(J, -i)
                det_val = abs(P.subs(t, -1))
                poly_val = P.expand()
                break
            p4 = (p3.subs(J, i)).simplify()
            if p4 == 0:
                P = p1.subs(J, i)
                det_val = abs(P.subs(t, -1))
                poly_val = P.expand()
                break
            i = i + 1
            if i > 50: # Previne loop infinito matemático
                break

    # === FORMATAÇÃO DA SAÍDA EM LATEX ===
    latex_geradores = ", ".join(geradores)
    latex_relacoes = ", ".join(relacoes)
    latex_grupo = f"\\[ \\pi_1(S^3 \\setminus K) = \\langle {latex_geradores} \\mid {latex_relacoes} \\rangle \\]"
    
    # Transforma a variável matemática do SymPy em string LaTeX
    latex_poly = sympy.latex(poly_val)
    
    latex_output = f"""
    {latex_grupo}
    \\[ \\text{{Knot Determinant: }} D = {det_val} \\]
    \\[ \\text{{Alexander Polynomial: }} \\Delta(t) = {latex_poly} \\]
    """

    document.getElementById("demo").innerHTML = latex_output

    if hasattr(window, "MathJax"):
        window.MathJax.typesetPromise()
