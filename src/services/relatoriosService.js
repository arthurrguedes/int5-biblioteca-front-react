export async function getTiposUsuarios() {
    const response = await fetch("http://localhost:4009/api/relatorios/usuarios/tipos");
    if (!response.ok) {
      throw new Error("Erro ao buscar tipos de usuários");
    }
    return response.json();
  }

export async function getUsuariosPorMes() {
    const response = await fetch("http://localhost:4009/api/relatorios/usuarios/mes");
    if (!response.ok) throw new Error("Erro ao buscar usuários por mês");
    return response.json();
}
    
export async function exportarUsuarios() {
    const response = await fetch("http://localhost:4009/api/relatorios/usuarios/exportar");
    if (!response.ok) throw new Error("Erro ao exportar relatório");
  
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
  
    // cria link temporário para download
    const a = document.createElement("a");
    a.href = url;
    a.download = "usuarios.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
export async function atualizarUsuarios() {
    const response = await fetch("http://localhost:4009/api/relatorios/usuarios/atualizar");
    if (!response.ok) throw new Error("Erro ao atualizar relatório");
    return response.json();
}
  