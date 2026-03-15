import React from 'react';

const Dashboard = () => {
  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Hola, Administrador</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Panel de Control</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Bienvenido al sistema de gestión de "Amar es Adoptar". 
            Desde aquí podrás agregar, editar o eliminar la información de los perritos, 
            así como actualizar los datos de los albergues. Todos los cambios que realices 
            aquí se reflejarán inmediatamente en el portal público de transparencia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
