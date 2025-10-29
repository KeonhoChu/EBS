import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Avatar,
// } from '@mui/material';
// import {
//   Add,
//   MoreVert,
//   Description,
//   Delete,
//   Edit,
//   Share,
//   Download,
//   Folder,
//   AccessTime,
// } from '@mui/icons-material';

// interface Notebook {
//   id: string;
//   title: string;
//   description?: string;
//   sourcesCount: number;
//   lastModified: Date;
//   color?: string;
// }

// interface NotebookListProps {
//   onNotebookSelect: (notebookId: string) => void;
//   onCreateNotebook: () => void;
// }

// const NotebookList: React.FC<NotebookListProps> = ({
//   onNotebookSelect,
//   onCreateNotebook,
// }) => {
//   const [notebooks] = useState<Notebook[]>([
//     {
//       id: '1',
//       title: 'My Research Notebook',
//       description: 'AI and Machine Learning research papers',
//       sourcesCount: 12,
//       lastModified: new Date('2025-10-27'),
//       color: '#1a73e8',
//     },
//     {
//       id: '2',
//       title: 'Product Documentation',
//       description: 'Technical docs and specifications',
//       sourcesCount: 8,
//       lastModified: new Date('2025-10-26'),
//       color: '#34a853',
//     },
//     {
//       id: '3',
//       title: 'Meeting Notes',
//       description: 'Q4 strategy meetings',
//       sourcesCount: 5,
//       lastModified: new Date('2025-10-25'),
//       color: '#fbbc04',
//     },
//   ]);

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notebookId: string) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//     setSelectedNotebook(notebookId);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedNotebook(null);
//   };

//   const formatDate = (date: Date) => {
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//     if (diffDays === 0) return 'Today';
//     if (diffDays === 1) return 'Yesterday';
//     if (diffDays < 7) return `${diffDays} days ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
//           Your Notebooks
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Create and organize your research with AI-powered notebooks
//         </Typography>
//       </Box>

//       {/* Notebooks Grid */}
//       <Grid container spacing={3}>
//         {/* Create New Card */}
//         <Grid item xs={12} sm={6} md={4}>
//           <Card
//             elevation={0}
//             sx={{
//               height: 240,
//               border: 2,
//               borderStyle: 'dashed',
//               borderColor: 'divider',
//               bgcolor: 'transparent',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               transition: 'all 0.2s',
//               '&:hover': {
//                 borderColor: 'primary.main',
//                 bgcolor: 'action.hover',
//               },
//             }}
//           >
//             <CardActionArea
//               onClick={onCreateNotebook}
//               sx={{
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <Box sx={{ textAlign: 'center' }}>
//                 <Avatar
//                   sx={{
//                     width: 64,
//                     height: 64,
//                     bgcolor: 'primary.50',
//                     color: 'primary.main',
//                     mx: 'auto',
//                     mb: 2,
//                   }}
//                 >
//                   <Add sx={{ fontSize: 32 }} />
//                 </Avatar>
//                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                   Create Notebook
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Start a new research project
//                 </Typography>
//               </Box>
//             </CardActionArea>
//           </Card>
//         </Grid>

//         {/* Existing Notebooks */}
//         {notebooks.map((notebook) => (
//           <Grid item xs={12} sm={6} md={4} key={notebook.id}>
//             <Card
//               elevation={0}
//               sx={{
//                 height: 240,
//                 border: 1,
//                 borderColor: 'divider',
//                 transition: 'all 0.2s',
//                 '&:hover': {
//                   borderColor: notebook.color || 'primary.main',
//                   boxShadow: 2,
//                   transform: 'translateY(-4px)',
//                 },
//               }}
//             >
//               <CardActionArea
//                 onClick={() => onNotebookSelect(notebook.id)}
//                 sx={{ height: '100%' }}
//               >
//                 <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
//                   {/* Header */}
//                   <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//                     <Avatar
//                       sx={{
//                         width: 48,
//                         height: 48,
//                         bgcolor: notebook.color + '20' || 'primary.50',
//                         color: notebook.color || 'primary.main',
//                         mr: 1.5,
//                       }}
//                     >
//                       <Folder />
//                     </Avatar>
//                     <Box sx={{ flex: 1, minWidth: 0 }}>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 600,
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                         }}
//                       >
//                         {notebook.title}
//                       </Typography>
//                       <IconButton
//                         size="small"
//                         onClick={(e) => handleMenuOpen(e, notebook.id)}
//                         sx={{ mt: -1 }}
//                       >
//                         <MoreVert fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   </Box>

//                   {/* Description */}
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{
//                       flex: 1,
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       display: '-webkit-box',
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: 'vertical',
//                       mb: 2,
//                     }}
//                   >
//                     {notebook.description || 'No description'}
//                   </Typography>

//                   {/* Footer */}
//                   <Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
//                       <Chip
//                         icon={<Description />}
//                         label={`${notebook.sourcesCount} sources`}
//                         size="small"
//                         variant="outlined"
//                       />
//                     </Box>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                       <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
//                       <Typography variant="caption" color="text.secondary">
//                         {formatDate(notebook.lastModified)}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </CardContent>
//               </CardActionArea>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Context Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//             <Edit fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Rename</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//             <Share fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Share</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose}>
//           <ListItemIcon>
//             <Download fontSize="small" />
//           </ListItemIcon>
//           <ListItemText>Export</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
//           <ListItemIcon>
//             <Delete fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText>Delete</ListItemText>
//         </MenuItem>
//       </Menu>
//     </Box>
//   );
// };

// export default NotebookList;
