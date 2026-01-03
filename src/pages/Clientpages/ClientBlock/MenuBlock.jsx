// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   deleteDoc,
//   doc,
// } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { db } from '../../../firbase/Firebase';
// import { ArrowLeft, User, X } from 'lucide-react';

// /* ======================================================
//    CLIENT BLOCKED USERS SCREEN - REACT VERSION
// ====================================================== */

// export default function ClientBlockedUsersScreen() {
//   const auth = getAuth();
//   const currentUser = auth.currentUser;

//   const [blockedUsers, setBlockedUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showUnblockDialog, setShowUnblockDialog] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   /* ================= FETCH BLOCKED USERS ================= */
//   useEffect(() => {
//     if (!currentUser) {
//       console.log('No current user');
//       return;
//     }

//     const q = query(
//       collection(db, 'blocked_users'),
//       where('blockedBy', '==', currentUser.uid)
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const users = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBlockedUsers(users);
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Error fetching blocked users:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [currentUser]);

//   /* ================= UNBLOCK USER ================= */
//   const handleUnblock = async (docId) => {
//     try {
//       await deleteDoc(doc(db, 'blocked_users', docId));
//       showToast('User unblocked successfully', 'success');
//       setShowUnblockDialog(false);
//       setSelectedUser(null);
//     } catch (error) {
//       console.error('Error unblocking user:', error);
//       showToast('Failed to unblock user', 'error');
//     }
//   };

//   /* ================= SHOW TOAST ================= */
//   const showToast = (message, type = 'info') => {
//     const toast = document.createElement('div');
//     const bgColor =
//       type === 'success'
//         ? '#10b981'
//         : type === 'error'
//         ? '#ef4444'
//         : '#6b7280';
    
//     toast.className = 'fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
//     toast.style.backgroundColor = bgColor;
//     toast.textContent = message;
//     document.body.appendChild(toast);
    
//     setTimeout(() => {
//       toast.style.animation = 'fade-out 0.3s ease-out';
//       setTimeout(() => toast.remove(), 300);
//     }, 3000);
//   };

//   /* ================= OPEN UNBLOCK DIALOG ================= */
//   const openUnblockDialog = (user) => {
//     setSelectedUser(user);
//     setShowUnblockDialog(true);
//   };

//   /* ================= GO BACK ================= */
//   const handleGoBack = () => {
//     window.history.back();
//   };

//   /* ================= LOADING STATE ================= */
//   if (loading) {
//     return (
//       <div style={styles.container}>
//         <Header onBack={handleGoBack} />
//         <div style={styles.centerContent}>
//           <div style={styles.spinner}></div>
//           <p style={styles.loadingText}>Loading blocked users...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ================= ERROR STATE ================= */
//   if (error) {
//     return (
//       <div style={styles.container}>
//         <Header onBack={handleGoBack} />
//         <div style={styles.centerContent}>
//           <p style={styles.errorText}>Error: {error}</p>
//         </div>
//       </div>
//     );
//   }

//   /* ================= RENDER ================= */
//   return (
//     <div style={styles.container}>
//       {/* HEADER */}
//       <Header onBack={handleGoBack} />

//       {/* CONTENT */}
//       <div style={styles.content}>
//         {blockedUsers.length === 0 ? (
//           <div style={styles.emptyState}>
//             <div style={styles.emptyIcon}>
//               <User size={48} color="#9ca3af" />
//             </div>
//             <p style={styles.emptyText}>No blocked accounts</p>
//           </div>
//         ) : (
//           <div style={styles.userList}>
//             {blockedUsers.map((user) => (
//               <BlockedUserRow
//                 key={user.id}
//                 user={user}
//                 onUnblock={() => openUnblockDialog(user)}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* UNBLOCK DIALOG */}
//       {showUnblockDialog && selectedUser && (
//         <UnblockDialog
//           userName={selectedUser.blockedUserName || 'Unknown'}
//           onCancel={() => {
//             setShowUnblockDialog(false);
//             setSelectedUser(null);
//           }}
//           onConfirm={() => handleUnblock(selectedUser.id)}
//         />
//       )}

//       <style>{`
//         @keyframes spin {
//           to { transform: rotate(360deg); }
//         }
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fade-out {
//           from { opacity: 1; }
//           to { opacity: 0; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ================= HEADER COMPONENT ================= */
// function Header({ onBack }) {
//   return (
//     <div style={styles.header}>
//       <button onClick={onBack} style={styles.backButton}>
//         <ArrowLeft size={24} color="#000" />
//       </button>
//       <h1 style={styles.headerTitle}>Blocked Accounts</h1>
//       <div style={styles.headerSpacer}></div>
//     </div>
//   );
// }

// /* ================= BLOCKED USER ROW COMPONENT ================= */
// function BlockedUserRow({ user, onUnblock }) {
//   const name = user.blockedUserName || 'Unknown';
//   const image = user.blockedUserImage || '';

//   return (
//     <div style={styles.userRow}>
//       {/* PROFILE IMAGE */}
//       <div style={styles.avatarContainer}>
//         {image ? (
//           <img src={image} alt={name} style={styles.avatar} />
//         ) : (
//           <div style={styles.avatarPlaceholder}>
//             <User size={24} color="#fff" />
//           </div>
//         )}
//       </div>

//       {/* NAME */}
//       <div style={styles.userName}>{name}</div>

//       {/* UNBLOCK BUTTON */}
//       <button onClick={onUnblock} style={styles.unblockButton}>
//         Unblock
//       </button>
//     </div>
//   );
// }

// /* ================= UNBLOCK DIALOG COMPONENT ================= */
// function UnblockDialog({ userName, onCancel, onConfirm }) {
//   return (
//     <div style={styles.dialogOverlay} onClick={onCancel}>
//       <div style={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
//         {/* CLOSE ICON */}
//         <button onClick={onCancel} style={styles.closeButton}>
//           <X size={20} color="#6b7280" />
//         </button>

//         {/* TITLE */}
//         <h2 style={styles.dialogTitle}>Unblock {userName}?</h2>

//         {/* DESCRIPTION */}
//         <p style={styles.dialogText}>
//           Unblocking will allow this profile to reach out to you again.
//         </p>

//         {/* ACTIONS */}
//         <div style={styles.dialogActions}>
//           <button onClick={onCancel} style={styles.cancelButton}>
//             Cancel
//           </button>
//           <button onClick={onConfirm} style={styles.confirmButton}>
//             Unblock
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {
//   container: {
//     minHeight: '100vh',
//     backgroundColor: '#fff',
//   },

//   header: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '16px 20px',
//     borderBottom: '1px solid #f3f4f6',
//     backgroundColor: '#fff',
//     position: 'sticky',
//     top: 0,
//     zIndex: 10,
//   },

//   backButton: {
//     width: 40,
//     height: 40,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     transition: 'background-color 0.2s',
//   },

//   headerTitle: {
//     margin: 0,
//     fontSize: 22,
//     fontWeight: 500,
//     color: '#000',
//   },

//   headerSpacer: {
//     width: 40,
//   },

//   content: {
//     padding: '12px 0',
//   },

//   centerContent: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 'calc(100vh - 80px)',
//   },

//   spinner: {
//     width: 40,
//     height: 40,
//     border: '4px solid #f3f4f6',
//     borderTopColor: '#7C3CFF',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//   },

//   loadingText: {
//     marginTop: 16,
//     fontSize: 14,
//     color: '#6b7280',
//   },

//   errorText: {
//     fontSize: 16,
//     color: '#ef4444',
//   },

//   emptyState: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '60px 20px',
//   },

//   emptyIcon: {
//     width: 80,
//     height: 80,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: '50%',
//     marginBottom: 16,
//   },

//   emptyText: {
//     fontSize: 16,
//     color: '#6b7280',
//     margin: 0,
//   },

//   userList: {
//     display: 'flex',
//     flexDirection: 'column',
//   },

//   userRow: {
//     display: 'flex',
//     alignItems: 'center',
//     padding: '10px 16px',
//     borderBottom: '1px solid #f3f4f6',
//     transition: 'background-color 0.2s',
//   },

//   avatarContainer: {
//     marginRight: 14,
//   },

//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: '50%',
//     objectFit: 'cover',
//   },

//   avatarPlaceholder: {
//     width: 44,
//     height: 44,
//     borderRadius: '50%',
//     backgroundColor: '#d1d5db',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   userName: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: 600,
//     color: '#000',
//   },

//   unblockButton: {
//     padding: '8px 18px',
//     backgroundColor: '#7C3CFF',
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: 500,
//     border: 'none',
//     borderRadius: 20,
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },

//   dialogOverlay: {
//     position: 'fixed',
//     inset: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1000,
//     padding: 24,
//   },

//   dialogContent: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: '24px 20px 20px',
//     width: '100%',
//     maxWidth: 400,
//     position: 'relative',
//     animation: 'fade-in 0.3s ease-out',
//   },

//   closeButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     width: 32,
//     height: 32,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     border: 'none',
//     background: 'none',
//     cursor: 'pointer',
//     borderRadius: '50%',
//     transition: 'background-color 0.2s',
//   },

//   dialogTitle: {
//     margin: '0 0 12px',
//     fontSize: 18,
//     fontWeight: 600,
//     color: '#000',
//     textAlign: 'center',
//   },

//   dialogText: {
//     margin: '0 0 24px',
//     fontSize: 14,
//     color: '#6b7280',
//     lineHeight: 1.5,
//     textAlign: 'center',
//   },

//   dialogActions: {
//     display: 'flex',
//     gap: 12,
//   },

//   cancelButton: {
//     flex: 1,
//     padding: '14px 0',
//     fontSize: 14,
//     fontWeight: 700,
//     color: '#000',
//     backgroundColor: '#fff',
//     border: '2px solid rgba(0, 0, 0, 0.4)',
//     borderRadius: 30,
//     cursor: 'pointer',
//     transition: 'all 0.2s',
//   },

//   confirmButton: {
//     flex: 1,
//     padding: '14px 0',
//     fontSize: 14,
//     fontWeight: 700,
//     color: '#fff',
//     backgroundColor: '#7C3CFF',
//     border: 'none',
//     borderRadius: 30,
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },
// };















import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firbase/Firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const BlockedUsersScreen = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unblockDialog, setUnblockDialog] = useState({
    open: false,
    docId: null,
    name: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch blocked users with real-time updates
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'blocked_users'),
      where('blockedBy', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlockedUsers(users);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching blocked users:', err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const handleUnblock = async () => {
    if (!unblockDialog.docId) return;

    try {
      await deleteDoc(doc(db, 'blocked_users', unblockDialog.docId));
      
      setSnackbar({
        open: true,
        message: 'User unblocked',
        severity: 'success'
      });
      
      setUnblockDialog({ open: false, docId: null, name: '' });
    } catch (error) {
      console.error('Error unblocking user:', error);
      setSnackbar({
        open: true,
        message: 'Failed to unblock user',
        severity: 'error'
      });
    }
  };

  const openUnblockDialog = (docId, name) => {
    setUnblockDialog({ open: true, docId, name });
  };

  const closeUnblockDialog = () => {
    setUnblockDialog({ open: false, docId: null, name: '' });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white',
          color: 'black'
        }}
      >
        <Toolbar>
          <IconButton 
            edge="start" 
            onClick={() => navigate(-1)}
            sx={{ color: 'black' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              textAlign: 'center',
              fontWeight: 500,
              fontSize: 22
            }}
          >
            Blocked Accounts
          </Typography>
          <Box sx={{ width: 40 }} /> {/* Spacer for centering */}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 2 }}>
        {blockedUsers.length === 0 ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight="60vh"
          >
            <Typography variant="h6" color="text.secondary">
              No blocked accounts
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 0 }}>
            {blockedUsers.map((user) => (
              <BlockedUserRow
                key={user.id}
                docId={user.id}
                name={user.blockedUserName || 'Unknown'}
                image={user.blockedUserImage || ''}
                onUnblock={openUnblockDialog}
              />
            ))}
          </List>
        )}
      </Container>

      {/* Unblock Confirmation Dialog */}
      <Dialog 
        open={unblockDialog.open} 
        onClose={closeUnblockDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            p: 1
          }
        }}
      >
        <DialogContent sx={{ px: 3, py: 4 }}>
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Unblock {unblockDialog.name}?
          </Typography>

          <Typography 
            variant="body2" 
            align="center" 
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Unblocking will allow this profile to reach out to you again.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={closeUnblockDialog}
              sx={{
                py: 1.5,
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.4)',
                color: 'black',
                fontWeight: 700,
                borderRadius: 8,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0.6)'
                }
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleUnblock}
              sx={{
                py: 1.5,
                bgcolor: '#7C3CFF',
                fontWeight: 700,
                borderRadius: 8,
                '&:hover': {
                  bgcolor: '#6A2EE6'
                }
              }}
            >
              Unblock
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Blocked User Row Component
const BlockedUserRow = ({ docId, name, image, onUnblock }) => {
  return (
    <ListItem
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {/* Profile Image */}
      <Avatar
        src={image || undefined}
        sx={{
          width: 44,
          height: 44,
          bgcolor: 'grey.300'
        }}
      >
        {!image && <PersonIcon />}
      </Avatar>

      {/* Name */}
      <Typography 
        variant="body1" 
        sx={{ 
          flexGrow: 1,
          fontWeight: 600,
          fontSize: 18
        }}
      >
        {name}
      </Typography>

      {/* Unblock Button */}
      <Button
        onClick={() => onUnblock(docId, name)}
        sx={{
          bgcolor: '#7C3CFF',
          color: 'white',
          px: 3,
          py: 1,
          borderRadius: 5,
          fontWeight: 500,
          fontSize: 15,
          textTransform: 'none',
          '&:hover': {
            bgcolor: '#6A2EE6'
          }
        }}
      >
        Unblock
      </Button>
    </ListItem>
  );
};

export default BlockedUsersScreen;