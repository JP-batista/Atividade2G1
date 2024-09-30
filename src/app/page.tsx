'use client';

import React, { useState, useEffect } from 'react';
import Layout from './layout';

interface Producao {
  id: number;
  titulo: string;
  tipo: 'Filme' | 'Série';
  ano: number;
  genero: string;
  sinopse: string;
  duracao?: number;
  temporadas?: number;
  avaliacao: number;
}

const Page: React.FC = () => {
  const [producoes, setProducoes] = useState<Producao[]>(() => {
    const stored = localStorage.getItem('producoes');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [formData, setFormData] = useState<Partial<Producao>>({ tipo: 'Filme', avaliacao: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('producoes', JSON.stringify(producoes));
  }, [producoes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: ['avaliacao', 'ano', 'duracao', 'temporadas'].includes(name) ? Number(value) : value });
  };

  const handleSubmit = () => {
    if (!formData.titulo || !formData.ano || !formData.genero || !formData.sinopse) return alert('Preencha todos os campos.');
    
    const newProducao = { ...formData, id: editingId !== null ? editingId : producoes.length + 1 } as Producao;
    
    setProducoes(editingId !== null ? producoes.map(p => (p.id === editingId ? newProducao : p)) : [...producoes, newProducao]);
    setEditingId(null);
    setFormData({ tipo: 'Filme', avaliacao: 0 });
  };

  const handleEdit = (id: number) => {
    const producaoToEdit = producoes.find(p => p.id === id);
    if (producaoToEdit) {
      setFormData(producaoToEdit);
      setEditingId(id);
    }
  };

  const handleDelete = (id: number) => {
    const producaoToDelete = producoes.find(p => p.id === id);
    if (producaoToDelete && producaoToDelete.avaliacao <= 3) {
      setProducoes(producoes.filter(p => p.id !== id));
    } else {
      alert('Produções com pontuação maior que 3 não podem ser excluídas.');
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <div style={{ flex: '1', marginRight: '20px' }}>
        <h2>{editingId ? 'Editar' : 'Adicionar'} Produção</h2>
        <div className="form-container">
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="Filme">Filme</option>
            <option value="Série">Série</option>
          </select>
          <input type="text" name="titulo" placeholder="Título" value={formData.titulo || ''} onChange={handleChange} />
          <input type="number" name="ano" placeholder="Ano" value={formData.ano || ''} onChange={handleChange} />
          <input type="text" name="genero" placeholder="Gênero" value={formData.genero || ''} onChange={handleChange} />
          <textarea name="sinopse" placeholder="Sinopse" value={formData.sinopse || ''} onChange={handleChange} />
          {formData.tipo === 'Filme' ? (
            <input type="number" name="duracao" placeholder="Duração (min)" value={formData.duracao || ''} onChange={handleChange} />
          ) : (
            <input type="number" name="temporadas" placeholder="Temporadas" value={formData.temporadas || ''} onChange={handleChange} />
          )}
          <input type="number" name="avaliacao" placeholder="Avaliação (0-5)" value={formData.avaliacao || ''} onChange={handleChange} min="0" max="5" />
          <button onClick={handleSubmit}>{editingId ? 'Salvar' : 'Adicionar'}</button>
        </div>
      </div>
      <div style={{ flex: '1' }}>
        <h2>Lista de Produções</h2>
        <ul className="producoes-list">
          {producoes.length > 0 ? (
            producoes.map(producao => (
              <li key={producao.id} className="producoes-item">
                <strong>{producao.titulo}</strong> ({producao.tipo}, {producao.ano}) 
                <p>{producao.sinopse}</p>
                <p>Avaliação: {producao.avaliacao}/5</p>
                <button onClick={() => handleEdit(producao.id)}>Editar</button>
                <button onClick={() => handleDelete(producao.id)} className="delete-button">Excluir</button>
              </li>
            ))
          ) : (
            <p>Nenhuma produção adicionada ainda.</p>
          )}
        </ul>
      </div>
    </main>
  );
};

export default Page;