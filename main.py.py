from js import document, window

def KnotGroup_OnClk():
    from js import VecUpDown, VD

    document.getElementById("demo").innerHTML = ""

    NC = len(VD) // 2  # Número de cruzamentos
    dNC = 2 * NC
    Var = 1

    # Atribuição das variáveis de arcos (x_1, x_2, ..., x_NC)
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

    for i in range(dNC):
        if VecUpDown[i][4] != 0:
            op = VecUpDown[i][5]

            if VecUpDown[i][0] == VecUpDown[i][2]:  # O segmento i passou por cima
                arco_over = VecUpDown[i][3]
                arco_A = get_arc(VecUpDown[op][3])
                arco_B = get_arc(VecUpDown[op][3] - 1)

                if VecUpDown[i][4] < 0:
                    # Relação: x_A * x_over = x_over * x_B
                    relacoes.append(f"x_{{{arco_A}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_B}}}")
                else:
                    # Relação: x_B * x_over = x_over * x_A
                    relacoes.append(f"x_{{{arco_B}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_A}}}")

            if VecUpDown[i][1] == VecUpDown[i][2]:  # O segmento j passou por cima
                arco_over = get_arc(VecUpDown[op][3])
                arco_A = VecUpDown[i][3]
                arco_B = get_arc(VecUpDown[i][3] - 1)

                if VecUpDown[i][4] < 0:
                    relacoes.append(f"x_{{{arco_B}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_A}}}")
                else:
                    relacoes.append(f"x_{{{arco_A}}} x_{{{arco_over}}} = x_{{{arco_over}}} x_{{{arco_B}}}")

    # Montagem do código LaTeX para o MathJax
    latex_geradores = ", ".join(geradores)
    latex_relacoes = ", ".join(relacoes)

    latex_output = f"\\[ \\pi_1(S^3 \\setminus K) = \\langle {latex_geradores} \\mid {latex_relacoes} \\rangle \\]"

    # Exibe no elemento #demo
    document.getElementById("demo").innerHTML = latex_output

    # Chama o renderizador do MathJax na janela do JS
    if hasattr(window, "MathJax"):
        window.MathJax.typesetPromise()