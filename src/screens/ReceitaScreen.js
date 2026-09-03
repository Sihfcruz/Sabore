import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReceitaItem from "../components/ReceitaItem";

const CHAVE_STORAGE = "@sabore:receitas";
const categorias = ["Sobremesa", "Salgado", "Bebida", "Outro"];
const filtros = ["Todas", "Favoritas", "Quero fazer", "Já fiz"];

const receitaVazia = {
  nome: "",
  categoria: "Sobremesa",
  ingredientes: "",
  preparo: "",
  status: "fazer",
  favorita: false,
};

export default function ReceitaScreen() {
  const [receitas, setReceitas] = useState([]);
  const [filtro, setFiltro] = useState("Todas");
  const [carregando, setCarregando] = useState(true);
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [receitaEditando, setReceitaEditando] = useState(null);
  const [formulario, setFormulario] = useState(receitaVazia);

  useEffect(() => {
    async function carregarReceitas() {
      try {
        const receitasSalvas = await AsyncStorage.getItem(CHAVE_STORAGE);
        if (receitasSalvas) setReceitas(JSON.parse(receitasSalvas));
      } catch (erro) {
        Alert.alert("Erro", "Não foi possível carregar suas receitas.");
      } finally {
        setCarregando(false);
      }
    }
    carregarReceitas();
  }, []);

  useEffect(() => {
    if (!carregando) {
      AsyncStorage.setItem(CHAVE_STORAGE, JSON.stringify(receitas)).catch(() => {
        Alert.alert("Erro", "Não foi possível salvar suas receitas.");
      });
    }
  }, [receitas, carregando]);

  function abrirNovaReceita() {
    setReceitaEditando(null);
    setFormulario(receitaVazia);
    setFormularioAberto(true);
  }

  function abrirEdicao(receita) {
    setReceitaEditando(receita);
    setFormulario({ ...receita });
    setFormularioAberto(true);
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }
  function salvarReceita() {
    if (!formulario.nome.trim() || !formulario.ingredientes.trim() || !formulario.preparo.trim()) {
      Alert.alert("Preencha os campos", "Nome, ingredientes e modo de preparo são obrigatórios.");
      return false;
    }

    if (receitaEditando) {
      setReceitas((atuais) => atuais.map((receita) =>
        receita.id === receitaEditando.id ? { ...formulario, id: receita.id } : receita,
      ));
    } else {
      setReceitas((atuais) => [...atuais, { ...formulario, id: Date.now().toString() }]);
    }

    setFormularioAberto(false);
  }

  function excluirReceita(id) {
    Alert.alert("Excluir receita", "Deseja realmente excluir esta receita?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => setReceitas((atuais) => atuais.filter((receita) => receita.id !== id)) },
    ]);
  }

  function alternarFavorito(id) {
    setReceitas((atuais) => atuais.map((receita) =>
      receita.id === id ? { ...receita, favorita: !receita.favorita } : receita,
    ));
  }

  function alternarStatus(id) {
    setReceitas((atuais) => atuais.map((receita) =>
      receita.id === id ? { ...receita, status: receita.status === "fazer" ? "feito" : "fazer" } : receita,
    ));
  }

  const receitasFiltradas = receitas.filter((receita) => {
    if (filtro === "Favoritas") return receita.favorita;
    if (filtro === "Quero fazer") return receita.status === "fazer";
    if (filtro === "Já fiz") return receita.status === "feito";
    return true;
  });

  if (formularioAberto) {
    return (
      <SafeAreaView style={styles.tela}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.formularioTela}>
            <TouchableOpacity onPress={() => setFormularioAberto(false)}>
              <Text style={styles.voltar}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.titulo}>{receitaEditando ? "Editar receita" : "Nova receita"}</Text>
            <Text style={styles.label}>Nome da receita</Text>
            <TextInput style={styles.input} value={formulario.nome} onChangeText={(valor) => atualizarCampo("nome", valor)} placeholder="Ex.: Bolo de chocolate" />
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.opcoes}>{categorias.map((categoria) => (
              <TouchableOpacity key={categoria} style={[styles.opcao, formulario.categoria === categoria && styles.opcaoAtiva]} onPress={() => atualizarCampo("categoria", categoria)}>
                <Text style={[styles.opcaoTexto, formulario.categoria === categoria && styles.opcaoTextoAtivo]}>{categoria}</Text>
              </TouchableOpacity>
            ))}</View>
            <Text style={styles.label}>Ingredientes</Text>
            <TextInput style={[styles.input, styles.areaTexto]} value={formulario.ingredientes} onChangeText={(valor) => atualizarCampo("ingredientes", valor)} placeholder="Separe os ingredientes por vírgula" multiline />
            <Text style={styles.label}>Modo de preparo</Text>
            <TextInput style={[styles.input, styles.areaTextoGrande]} value={formulario.preparo} onChangeText={(valor) => atualizarCampo("preparo", valor)} placeholder="Explique como preparar" multiline />
            <Text style={styles.label}>Status</Text>
            <View style={styles.opcoes}>{[["fazer", "Quero fazer"], ["feito", "Já fiz"]].map(([valor, texto]) => (
              <TouchableOpacity key={valor} style={[styles.opcao, formulario.status === valor && styles.opcaoAtiva]} onPress={() => atualizarCampo("status", valor)}>
                <Text style={[styles.opcaoTexto, formulario.status === valor && styles.opcaoTextoAtivo]}>{texto}</Text>
              </TouchableOpacity>
            ))}</View>
            <TouchableOpacity style={styles.botaoPrincipal} onPress={salvarReceita}>
              <Text style={styles.botaoPrincipalTexto}>{receitaEditando ? "Salvar alterações" : "Salvar receita"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.marca}>Saborê</Text>
          <Text style={styles.subtitulo}>Seu caderno de receitas</Text>
        </View>
        <TouchableOpacity style={styles.botaoNovo} onPress={abrirNovaReceita} accessibilityLabel="Adicionar receita">
          <Text style={styles.botaoNovoTexto}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filtros}>{filtros.map((item) => (
        <TouchableOpacity key={item} style={[styles.filtro, filtro === item && styles.filtroAtivo]} onPress={() => setFiltro(item)}>
          <Text style={[styles.filtroTexto, filtro === item && styles.filtroTextoAtivo]}>{item}</Text>
        </TouchableOpacity>
      ))}</View>
      <Text style={styles.tituloLista}>{filtro === "Todas" ? "Minhas receitas" : filtro}</Text>
      {carregando ? <Text style={styles.mensagem}>Carregando...</Text> : <FlatList
        data={receitasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReceitaItem receita={item} aoEditar={abrirEdicao} aoExcluir={excluirReceita} aoFavoritar={alternarFavorito} aoAlternarStatus={alternarStatus} />}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={<Text style={styles.mensagem}>Nenhuma receita aqui ainda. Cadastre a primeira!</Text>}
      />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tela: { flex: 1, backgroundColor: "#f8f1e9" },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  marca: {
    color: "#713316",
    fontSize: 30,
    fontWeight: "700",
    fontStyle: "italic",
  },
  subtitulo: { color: "#8f7566", fontSize: 12, marginTop: 2 },
  botaoNovo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#713316",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 32,
  },
  filtros: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 7,
    marginBottom: 20,
  },
  filtro: {
    borderWidth: 1,
    borderColor: "#dfcfc0",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  filtroAtivo: { backgroundColor: "#713316", borderColor: "#713316" },
  filtroTexto: { color: "#806d60", fontSize: 11 },
  filtroTextoAtivo: { color: "#fff", fontWeight: "600" },
  tituloLista: {
    color: "#3e2418",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  lista: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1 },
  mensagem: {
    textAlign: "center",
    color: "#947e70",
    padding: 28,
    lineHeight: 20,
  },
  formularioTela: { padding: 20, paddingBottom: 36 },
  voltar: { color: "#9a431c", fontWeight: "600", marginBottom: 20 },
  titulo: {
    color: "#3e2418",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
  },
   label: {
    color: "#60473a",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "#dfcfc0",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: "#3e2418",
  },
  areaTexto: { minHeight: 72, textAlignVertical: "top" },
  areaTextoGrande: { minHeight: 120, textAlignVertical: "top" },
  opcoes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  opcao: {
    borderWidth: 1,
    borderColor: "#dfcfc0",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  opcaoAtiva: { backgroundColor: "#f0d9c4", borderColor: "#b66a3b" },
  opcaoTexto: { color: "#806d60", fontSize: 12 },
  opcaoTextoAtivo: { color: "#713316", fontWeight: "700" },
  botaoPrincipal: {
    backgroundColor: "#713316",
    borderRadius: 9,
    padding: 14,
    alignItems: "center",
    marginTop: 28,
  },
  botaoPrincipalTexto: { color: "#fff", fontWeight: "700" },
 
});
