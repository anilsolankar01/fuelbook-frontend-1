import React from 'react';
import { Table, Badge, Button } from 'react-bootstrap';
import './AuthorsTable.css';

const authors = [
  { id: 1, name: 'John Michael', email: 'john@creative-tim.com', function: 'Manager', department: 'Organization', status: 'Online', employed: '23/04/18' },
  { id: 2, name: 'Alexa Liras', email: 'alexa@creative-tim.com', function: 'Programator', department: 'Developer', status: 'Offline', employed: '11/01/19' },
  { id: 3, name: 'Laurent Perrier', email: 'laurent@creative-tim.com', function: 'Executive', department: 'Projects', status: 'Online', employed: '19/09/17' },
  { id: 4, name: 'Michael Levi', email: 'michael@creative-tim.com', function: 'Programator', department: 'Developer', status: 'Online', employed: '24/12/08' },
  { id: 5, name: 'Richard Gran', email: 'richard@creative-tim.com', function: 'Manager', department: 'Executive', status: 'Offline', employed: '04/10/21' },
  { id: 6, name: 'Miriam Eric', email: 'miriam@creative-tim.com', function: 'Programator', department: 'Developer', status: 'Offline', employed: '14/09/20' },
];

const AuthorsTable = () => {
  return (
    <div className="authors-table-container">
      <h4 className="authors-table-title">Authors Table</h4>
      <Table responsive>
        <thead>
          <tr>
            <th>Author</th>
            <th>Function</th>
            <th>Status</th>
            <th>Employed</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>
                <div className="author-info">
                  <img
                    src={`https://randomuser.me/api/portraits/med/men/${author.id}.jpg`}
                    alt={author.name}
                    className="author-img"
                  />
                  <div>
                    <h6>{author.name}</h6>
                    <p>{author.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <h6>{author.function}</h6>
                  <p>{author.department}</p>
                </div>
              </td>
              <td>
                <Badge bg={author.status === 'Online' ? 'success' : 'secondary'}>
                  {author.status}
                </Badge>
              </td>
              <td>{author.employed}</td>
              <td>
                <Button variant="link">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AuthorsTable;
