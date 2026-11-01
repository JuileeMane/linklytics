import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { CreateLinkModal } from '../components/links/CreateLinkModal';

export const DashboardLayout = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onOpenCreateModal={() => setCreateModalOpen(true)} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            minWidth: 0, // prevents overflow in flex container
          }}
        >
          <Outlet context={{ openCreateModal: () => setCreateModalOpen(true) }} />
        </Box>
      </Box>
      <Footer />
      <CreateLinkModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Box>
  );
};
