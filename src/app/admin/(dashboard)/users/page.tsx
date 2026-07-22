'use client';

import { useState, useEffect } from 'react';

interface UserItem {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SUBADMIN');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSession();
    fetchUsers();
  }, []);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        setCurrentUser(await res.json());
      }
    } catch (err) {
      console.error('Erro ao buscar sessão:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro ao carregar usuários');
      }
      setUsers(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setEmail('');
    setPassword('');
    setRole('SUBADMIN');
    setError('');
    setSuccess('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditId(user.id);
    setEmail(user.email);
    setPassword(''); // keep blank unless changing
    setRole(user.role);
    setError('');
    setSuccess('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      if (editId) {
        // Edit User
        const res = await fetch(`/api/users/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            role,
            password: password.trim() !== '' ? password : undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao atualizar funcionário');
        setSuccess('Funcionário atualizado com sucesso!');
      } else {
        // Create User
        if (!password) {
          throw new Error('A senha é obrigatória para novos funcionários');
        }
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar funcionário');
        setSuccess('Funcionário cadastrado com sucesso!');
      }

      setIsFormOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza de que deseja remover o acesso deste funcionário?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir funcionário');
      setSuccess('Funcionário removido com sucesso!');
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (currentUser && currentUser.role !== 'ADMIN') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>Acesso Proibido</h1>
        <p>Apenas administradores gerais possuem autorização para gerenciar as contas de funcionários.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="admin-title">Gerenciamento de Funcionários</h1>
          <p style={{ color: 'var(--admin-text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
            Cadastre sub-admins e gerencie as contas que possuem acesso ao painel de controle.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          Adicionar Funcionário
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {isFormOpen && (
        <div className="admin-card" style={{ marginBottom: '30px', animation: 'fadeIn 0.25s ease' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 700 }}>
            {editId ? 'Editar Funcionário' : 'Novo Funcionário'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="user-email">E-mail</label>
                <input
                  id="user-email"
                  type="email"
                  className="input-control"
                  placeholder="exemplo@imaster.com.br"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-role">Nível de Permissão</label>
                <select
                  id="user-role"
                  className="input-control"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="SUBADMIN">Funcionário / Sub-admin</option>
                  <option value="ADMIN">Administrador Geral</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="user-password">
                  {editId ? 'Nova Senha (deixe em branco para manter)' : 'Senha de Acesso'}
                </label>
                <input
                  id="user-password"
                  type="password"
                  className="input-control"
                  placeholder={editId ? 'Preencha apenas se quiser alterar' : 'Mínimo 6 caracteres'}
                  required={!editId}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsFormOpen(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Funcionário'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Carregando lista de funcionários...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
            Nenhum funcionário cadastrado.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>E-mail</th>
                  <th>Permissão</th>
                  <th>Data de Cadastro</th>
                  <th style={{ width: '180px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 600 }}>{user.email}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor:
                            user.role === 'ADMIN' ? 'rgba(10, 61, 44, 0.08)' : 'rgba(107, 114, 128, 0.08)',
                          color: user.role === 'ADMIN' ? 'var(--color-primary)' : '#4b5563',
                        }}
                      >
                        {user.role === 'ADMIN' ? 'Administrador' : 'Funcionário / Sub-admin'}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(user)}>
                          Editar
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            backgroundColor: 'transparent',
                          }}
                          disabled={currentUser?.id === user.id}
                          onClick={() => handleDelete(user.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
