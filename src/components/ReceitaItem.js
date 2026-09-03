import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReceitaItem({ receita, aoEditar, aoExcluir, aoFavoritar, aoAlternarStatus }) {
  const statusTexto = receita.status === "fazer" ? "Quero fazer" : "Já fiz";

  return (
    <View style={styles.card}>
      <View style={styles.iconeReceita}>
        <Text style={styles.iconeTexto}>R</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.linhaTitulo}>
          <TouchableOpacity style={styles.areaTitulo} onPress={() => aoEditar(receita)}>
            <Text style={styles.nome}>{receita.nome}</Text>
            <Text style={styles.categoria}>{receita.categoria}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => aoFavoritar(receita.id)} accessibilityLabel="Favoritar receita">
            <Text style={[styles.coracao, receita.favorita && styles.coracaoAtivo]}>
              {receita.favorita ? "♥" : "♡"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.ingredientes} numberOfLines={2}>
          {receita.ingredientes}
        </Text>

        <View style={styles.rodape}>
          <TouchableOpacity style={styles.status} onPress={() => aoAlternarStatus(receita.id)}>
            <Text style={styles.statusTexto}>{statusTexto}</Text>
          </TouchableOpacity>
          <View style={styles.acoes}>
            <TouchableOpacity onPress={() => aoEditar(receita)}>
              <Text style={styles.editar}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => aoExcluir(receita.id)}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#eaded3",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  iconeReceita: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f0e2d5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconeTexto: { color: "#9a431c", fontSize: 18, fontWeight: "700" },
  conteudo: { flex: 1 },
  linhaTitulo: { flexDirection: "row", alignItems: "flex-start" },
  areaTitulo: { flex: 1 },
  nome: { color: "#3e2418", fontSize: 16, fontWeight: "700" },
  categoria: { color: "#9a431c", fontSize: 12, marginTop: 3 },
  coracao: { color: "#bda99b", fontSize: 25, lineHeight: 25, paddingLeft: 8 },
  coracaoAtivo: { color: "#c94d32" },
  ingredientes: { color: "#6e5a4d", fontSize: 12, lineHeight: 18, marginTop: 10 },
  rodape: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  status: { backgroundColor: "#f4e6ba", borderRadius: 12, paddingVertical: 5, paddingHorizontal: 9 },
  statusTexto: { color: "#775117", fontSize: 11, fontWeight: "600" },
  acoes: { flexDirection: "row", gap: 14 },
  editar: { color: "#9a431c", fontSize: 12, fontWeight: "600" },
  excluir: { color: "#b8493d", fontSize: 12, fontWeight: "600" },
});