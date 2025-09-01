<template>
  <div class="container">
    <section class="card">
      <h3>Consultar Preço</h3>
      <form @submit.prevent="consultarPreco" class="form">
        <input v-model="descricaoProduto" placeholder="Descrição do produto" />
        <input v-model="dataHoraConsulta" type="datetime-local" />
        <button type="submit">Consultar</button>
        <button type="button" @click="limparConsulta" class="button-clear">Limpar Consulta</button>
      </form>
      <p v-if="erroConsulta" class="error-msg">{{ erroConsulta }}</p>
    </section>

    <!-- Lista -->
    <section v-if="produtos.length" class="card">
      <h3>Preços</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Data Hora</th>
            <th>Situação</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in produtos" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.produto.descricao }}</td>
            <td>{{ formatarData(p.dataHora) }}</td>
            <td>{{ calcularSituacao(p.id, p.produto.id, p.dataHora) }}</td>
            <td>{{ p.valor }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="erro" class="error-msg">{{ erro }}</p>
    </section>

    <section class="card">
      <h3>Cadastrar Novo Preço</h3>
      <form @submit.prevent="cadastrarPreco" class="form">
        <select v-model="produtoSelecionado">
          <option disabled value="">Selecione um produto</option>
          <option v-for="p in produtos" :key="p.produto.id" :value="p.produto.id">
            {{ p.produto.dataHoraLancamento ? p.produto.descricao : `x ${p.produto.descricao}` }}
          </option>
        </select>
        <input v-model="novoValor" type="number" step="0.01" placeholder="Valor do preço" />
        <input v-model="novaDataHora" type="datetime-local" />
        <input v-model="novoMotivo" placeholder="Motivo (opcional)" />
        <button type="submit">Cadastrar</button>
      </form>
      <p v-if="erroCadastro" class="error-msg">{{ erroCadastro }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Produto {
  id: number
  descricao: string
}

interface Preco {
  id: number
  dataHora: string
  valor: number
  motivo?: string
  produto: Produto
}

const produtos = ref<Preco[]>([])
const erro = ref('')
const erroCadastro = ref('')
const erroConsulta = ref('')

const produtoSelecionado = ref('')
const novoValor = ref('')
const novaDataHora = ref('')
const novoMotivo = ref('')

const descricaoProduto = ref('')
const dataHoraConsulta = ref('')

function calcularSituacao(id: number, produtoId: number, dataHora: string): string {
  const atual = new Date(dataHora)
  return produtos.value.some(p => p.id !== id && p.produto.id === produtoId && new Date(p.dataHora) > atual)
    ? 'Remarcado'
    : 'Atualizado'
}

function formatarData(dataHora: string): string {
  const d = new Date(dataHora)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

async function carregarPrecos() {
  try {
    const resp = await axios.get('preco')
    produtos.value = resp.data
    erro.value = ''
  } catch {
    erro.value = 'Erro ao carregar preços'
  }
}

async function cadastrarPreco() {
  erroCadastro.value = ''
  if (!produtoSelecionado.value || !novoValor.value || !novaDataHora.value) {
    erroCadastro.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  try {
    await axios.post('preco', {
      dataHora: novaDataHora.value,
      valor: parseFloat(novoValor.value),
      motivo: novoMotivo.value || null,
      produto: { id: produtoSelecionado.value },
    })
    await carregarPrecos()
    produtoSelecionado.value = ''
    novoValor.value = ''
    novaDataHora.value = ''
    novoMotivo.value = ''
  } catch {
    erroCadastro.value = 'Erro ao cadastrar preço.'
  }
}

async function consultarPreco() {
  erroConsulta.value = ''
  produtos.value = []

  if (!descricaoProduto.value.trim() || !dataHoraConsulta.value) {
    erroConsulta.value = 'Preencha todos os campos obrigatórios.'
    return
  }

  try {
    const resp = await axios.get(`preco/${encodeURIComponent(descricaoProduto.value.trim())}/${encodeURIComponent(dataHoraConsulta.value)}`)
    produtos.value = resp.data
  } catch {
    erroConsulta.value = 'Erro ao consultar preço.'
  }
}

function limparConsulta() {
  descricaoProduto.value = ''
  dataHoraConsulta.value = ''
  erroConsulta.value = ''
  produtos.value = []
  carregarPrecos()
}

onMounted(carregarPrecos)
</script>

<style>
body, #app {
  color: #111;
  font-family: sans-serif;
  margin: 0;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #18181800;
  padding: 2em;
}
.card {
  width: 100%;
  max-width: 600px;
  background: #fff;
  padding: 2em;
  margin-top: 2em;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.table thead {
  background: #f3f3f3;
}
.error-msg {
  color: red;
  margin-top: 0.5em;
}
.button-clear {
  background: #eee;
  color: #333;
}
</style>
