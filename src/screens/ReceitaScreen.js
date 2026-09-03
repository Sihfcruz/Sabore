import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {} from "react-native";
import ReceitaItem from "../components/ReceitaItem";

const CHAVE_STORAGE = "@sabore:receitas";
const categorias = ["Sobremesa", "Salgado", "Bebida", "Outro"];
const filtros = ["Todas", "Favoritas", "Quero fazer", "Já fiz"];