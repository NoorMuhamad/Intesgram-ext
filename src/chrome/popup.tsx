import * as React from "react";
import ReactDOM from "react-dom";

import ICSettings from "../components/ICSettings";
import Logo from "../components/Logo";
import useChromeStorage from "../hooks/useChromeStorage";
import { WELCOME_PAGE } from "../utils/constants";
import * as Styled from "./popup.styled";
import "./common.css";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


interface Column {
  id: 'name' | 'image' | 'action' ;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Profile Name', minWidth: 20 },
  { id: 'image', label: 'Image', minWidth: 40 },
  {
    id: 'action',
    label: 'Actions',
    minWidth: 10,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  }
];

interface Data {
  name: string;
  image: string;
  action: any;
  _id:number;
}

function createData(
  name: string,
  image: string,
  action: any,
  _id:number,
): Data {
  return { name, image, action,_id};
}


export default function StickyHeadTable() {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
}


const Popup = () => {
  const [rows, setRows] = React.useState([]);
  const [openAIKey, setOpenAIKey, { loading }] = useChromeStorage<string>(
    "social-comments-openapi-key",
    ""
  );

  const handleOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 

  interface ImageItem {
    imageUserProfile: string;
    image: string;
    action:any;
    _id:number;
  }
  
  React.useEffect(()=>{
    getAllImages();
  },[])   
  
  function getAllImages(){
    fetch('http://localhost:3000/instagram-photos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      return response.json();
    })
    .then((images: ImageItem[]) => {
      const fetchedRows:any = images.map(item => createData(item.imageUserProfile, item.image,DeleteIcon, item._id));
      setRows(fetchedRows);
      console.log("=====fetched rows",fetchedRows);
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
  }

  const handleDeleteImage=(id:number)=>{
    fetch(`http://localhost:3000/instagram-photos/${id}`, {
      method: 'DELETE'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to delete image');
          }
          getAllImages();
          // Image successfully deleted
          console.log('Image deleted successfully');
      })
      .catch(error => {
          console.error('Error deleting image:', error);
      });
  }

  return (
    <Styled.Wrapper>
      <div>
        <div className="flex justify-center" style={{display:'flex',justifyContent:'center'}}>
          <h2>Instagram Images Downloader</h2>
        </div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 370,minWidth:650 }}>
            <Table sx={{ maxWidth: '650px', maxHeight: 340, minWidth: 200 }} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow style={{backgroundColor:'grey'}}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight:'bold' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length>0 && rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row:any) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.image}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          <img src={row.image} alt={row.name} style={{ width: '60px', height: 'auto' }} />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={()=>handleDeleteImage(row._id)}>
                            <DeleteIcon style={{color:'red'}}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>    
      </div>
    </Styled.Wrapper>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
