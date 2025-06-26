<template>
  <div>
    <form @submit.prevent="incluir">
      <p>
        <label for="produto">
          Produto:
        </label>
        <select id="produto" v-model="idProduto" required>
          <option v-for="produto in produtos" :key="produto.id" :value="produto.id">{{ produto.descricao }}</option>
        </select>
      </p>
      <p>
        <label for="dataHora">
          Data/hora:
        </label>
        <input id="dataHora" type="datetime-local" v-model="dataHora" required>
      </p>
      <p>
        <label for="valor">
          Valor:
        </label>
        <input id="valor" type="number" step=".01" v-model="valor" required>
      </p>
      <p>
        <label for="comentario">
          Comentário:
        </label>
        <input id="comentario" type="text" v-model="comentario">
      </p>
      <button type="submit">Cadastrar</button>
    </form>
    <p v-if="erro">{{ erro }}</p>

    <table>
      <thead>
        <tr>
          <td>Id</td>
          <td>Produto</td>
          <td>Data/hora</td>
          <td>Valor</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cotacao in cotacoes" :key="cotacao.id">
          <td>{{ cotacao.id }}</td>
          <td>{{ cotacao.produto.descricao }}</td>
          <td>{{ cotacao.dataHora }}</td>
          <td>{{ cotacao.valor }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { onMounted } from 'vue'

const erro = ref<string>('')

interface Produto {
  id?: number,
  descricao: string,
  dataHoraAnuncio: Date,
  dataHoraLancamento?: Date
}

interface Cotacao {
  id?: number,
  dataHora: Date,
  valor: number,
  comentario: string,
  produto: Produto
}

const produtos = ref<Produto[]>()

const cotacoes = ref<Cotacao[]>()

const idProduto = ref<number>()

const dataHora = ref<Date>()

const valor = ref<number>()

const comentario = ref<string>()

async function getProdutos() {
  try {
    produtos.value = (await axios.get('produto')).data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function atualizar() {
  try {
    cotacoes.value = (await axios.get('cotacao')).data
    erro.value = ''
  } catch (e) {
    erro.value = (e as Error).message
  }
}

async function incluir() {
  erro.value = 'Gravando...'
  try {
    await axios.post('cotacao',
      {
        dataHora: dataHora.value,
        valor: valor.value,
        comentario: comentario.value,
        produto: {
          id: idProduto.value
        }
      })
    erro.value = ''
    comentario.value = ''
    dataHora.value = undefined
    idProduto.value = undefined
    valor.value = undefined
    atualizar()
  } catch (e) {
    erro.value = (e as Error).message
  }
}

onMounted(() => {
  getProdutos()
  atualizar()
})
</script>
