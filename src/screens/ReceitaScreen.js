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
      return;
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

  