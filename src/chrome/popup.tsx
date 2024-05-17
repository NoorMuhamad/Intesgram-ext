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
import CopyIcon from '@mui/icons-material/CopyAllRounded';
import DownloadIcon from '@mui/icons-material/Download';

import { Button, Tooltip } from "@mui/material";
import JSZip from "jszip";
import { saveAs } from 'file-saver';

interface Column {
  id: 'name' | 'image' | 'action';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Profile Name', minWidth: 20 },
  { id: 'image', label: 'Image', minWidth: 40 },
  {
    id: 'action',
    label: 'Actions',
    minWidth: 10,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  }
];

interface Data {
  name: string;
  image: string;
  action: any;
  _id: number;
}

function createData(
  name: string,
  image: string,
  action: any,
  _id: number,
): Data {
  return { name: `@${name}`, image, action, _id };
}

const Popup = () => {
  const [rows, setRows] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openTooltipIndex, setOpenTooltipIndex] = React.useState(-1);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };



  const handleTooltipClose = () => {
    setOpenTooltipIndex(-1);
  };


  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  interface ImageItem {
    imageUserProfile: string;
    image: string;
    action: any;
    _id: number;
  }

  React.useEffect(() => {
    getAllImages();
  }, [])

  function getAllImages() {
    fetch('http://localhost:3000/instagram-photos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        return response.json();
      })
      .then((images: ImageItem[]) => {
        const fetchedRows: any = images.map(item => createData(item.imageUserProfile, item.image, DeleteIcon, item._id));
        setRows(fetchedRows);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }

  const handleDeleteImage = (id: number) => {
    fetch(`http://localhost:3000/instagram-photos/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete image');
        }
        getAllImages();
        console.log('Image deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting image:', error);
      });
  }

  const handleCopyToClipboard = (imageUserProfile: string, index: number) => {
    navigator.clipboard.writeText(imageUserProfile)
    setOpenTooltipIndex(index);
  }

  const handleDownloadAll = async () => {

    const zip = new JSZip();

    await Promise.all(rows.map(async (row: Data, index) => {
      try {
        const response = await fetch(row.image);
        const blob = await response.blob();
        const fileName = `image_${index + 1}.jpg`;

        zip.file(fileName, blob);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }));

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'images.zip');
    });

  }

  const handleSingleDownload = async (imageUrl: string) => {

    await fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', blobUrl);
        downloadLink.setAttribute('download', 'image.jpg');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  }

  return (
    <Styled.Wrapper>
      <div>
        <div className="flex justify-center" style={{ display: 'flex', justifyContent: 'center' }}>
          <h2>Instagram Images Downloader</h2>
        </div>
        {rows.length > 1 && <p style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button component="label"
            role={undefined}
            variant="contained"
            endIcon={<DownloadIcon />}
            style={{ textTransform: 'none' }}
            onClick={handleDownloadAll}
          >
            Download All
          </Button>
        </p>}
        {rows.length ? <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 370, minWidth: 650 }}>
            <Table sx={{ maxWidth: '650px', maxHeight: 340, minWidth: 200 }} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow style={{ backgroundColor: 'grey' }}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 && rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: number) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>{row.name}
                          <Tooltip
                            placement="top"
                            PopperProps={{
                              disablePortal: true,
                            }}
                            onClose={handleTooltipClose}
                            open={openTooltipIndex === index}
                            disableFocusListener
                            disableTouchListener
                            title="Copied to clipboard">
                            <IconButton onClick={() => handleCopyToClipboard(row.name, index)}>
                              <CopyIcon style={{ color: 'black' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <img src={row.image} alt={row.name} style={{ width: '60px', height: 'auto' }} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton onClick={() => handleDeleteImage(row._id)}>
                            <DeleteIcon style={{ color: 'red' }} />
                          </IconButton>

                          <IconButton onClick={() => handleSingleDownload(row.image)}>
                            <DownloadIcon color="primary" />
                          </IconButton>

                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper> :
          <p>
            <h2>Nothing to display</h2>
            <h3>Click on the image's download button to download images</h3>
          </p>
        }
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
