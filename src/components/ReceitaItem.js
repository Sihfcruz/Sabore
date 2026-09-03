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
