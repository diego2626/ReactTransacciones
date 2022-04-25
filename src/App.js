import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Table, Button, Container, Modal, ModalBody, ModalHeader, FormGroup, ModalFooter} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import {AppBar, Toolbar} from '@material-ui/core'
import {
  useNavigate,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { createTheme, ThemeProvider } from '@material-ui/core';
import './navbar.css';


const initialState = {
  modalInsertar: false,
  modalEditar: false,
  modalInsertarUsuario: false,
  modalEditarUsuario: false,
  usuarioSelected: 0,
  itemSelected: 0,
  token:'',
  descripcion: '',
  monto: '',
  concepto: '',
  logeando: true,
  userName: '',
  password: '',
  entities: [],
  usuarios: []
};

const url = 'https://nodetransacciones.herokuapp.com/';

const theme = createTheme({
  typography: {
    fontSize: 16,
    h3: {
      fontWeight: 700,
      fontSize: '2.2rem'
    }
  }
})

const Usuarios = () => {
  const state = useSelector(x => x);

  const navigate = useNavigate();

  if (state.token !== '') { 
    return navigate("/transacciones");
  }
  else{
  return (
      <Container>
      <h2>Usuarios</h2>
        <ModalLogin></ModalLogin>
      </Container>
    );
  }
}

const styles = { "margin-top": '5.0rem' };


const NavBar = () => {
  return (
    
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
        <div className='sum'>
          <div className='logo'>
            Banco
          </div>
              <ul className='ul'>
                <li className='li'>
                  <Link to='/transacciones' className='links'>Transacciones</Link>
                </li>
                <li className='li'>
                  <Link to='/usuarios' className="links">Usuarios</Link>
                </li>
              </ul>
          </div>
        </Toolbar>
      </AppBar>
     </ThemeProvider>
  );
}

const PestaniaTransacciones = () => {
  const estilo = {"margin-top": '2.0rem'}
  return (
    <Container style={estilo}>
      <TablaTransacciones></TablaTransacciones>
      <ModalTransacciones></ModalTransacciones>
    </Container>
    )
}

const PestaniaUsuarios = ()=>
{
  const estilo = {"margin-top": '2.0rem'}
  return (
    <Container style={estilo}>
      <TablaUsuarios></TablaUsuarios>
      <ModalUsuarios></ModalUsuarios>
    </Container>
    )
}

const TablaUsuarios = () => {
  const dispatch = useDispatch();

  const state = useSelector(x => x);

  return (
    <Container>
      <h2>Usuarios</h2>
      <br></br>
      <Button color="success" onClick= {() => dispatch({type: 'mostrarModalInsertarUsuario'})} > Insertar</Button>
      <Table>
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Mail</th>
        </tr>
        </thead>
        <tbody>
        {state.usuarios.map((elem) => {
          return (
          <tr>
            <td>{elem.nombre}</td>
            <td>{elem.mail}</td>
            <td><Button color="primary" onClick={() => dispatch({type: 'mostrarModalEditarUsuario', payload: elem})}> Editar </Button></td>
            <td><Button color="danger" onClick={() => dispatch(deleteUsuario(elem, state.token))}> Eliminar </Button></td>
          </tr>
          )})}

        </tbody>

      </Table>
    </Container>
  )
}
const TablaTransacciones = () => {
  const dispatch = useDispatch();

  const state = useSelector(x => x);

  return (
    <Container>
      <h2>Transacciones</h2>
      <br></br>
      <Button color="success" onClick= {() => dispatch({type: 'mostrarModalInsertar'})} > Insertar</Button>
      <Table>
        <thead>
        <tr>
          <th>Monto</th>
          <th>Concepto</th>
          <th>Descripcion</th>
        </tr>
        </thead>
        <tbody>
        {state.entities.map((elem) => {
          return (
          <tr>
            <td>{elem.monto}</td>
            <td>{elem.concepto}</td>
            <td>{elem.descripcion}</td>
            <td><Button color="primary" onClick={() => dispatch({type: 'mostrarModalEditar', payload: elem})}> Editar </Button></td>
            <td><Button color="danger" onClick={() => dispatch(deleteTransaction(elem))}> Eliminar </Button></td>
          </tr>
          )})}

        </tbody>

      </Table>
    </Container>
  )
}

const ModalLogin = () => {
  const dispatch = useDispatch();

  const state = useSelector(x => x);
  return (
    <Modal isOpen={true} style={styles}>
      <ModalHeader>
        <div>
          <h3>Login</h3>  
        </div>
      </ModalHeader>
      <ModalBody>
        <FormGroup>
              <label>User name: </label>
              <input type="text" name="userName" className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})} >
              </input>
        </FormGroup>
        <FormGroup>
              <label>Password: </label>
              <input type="password" name="password" className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})}>
              </input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={ () => dispatch(loggearseEnApi(state.userName, state.password))}>
          Log in
        </Button>
      </ModalFooter>
    </Modal>
  )
}

const ModalTransacciones = () => {
  const dispatch = useDispatch();

  const state = useSelector(x => x);
  const styles = { "margin-top": '5.0rem' };

  return (
    <Modal isOpen = {state.modalInsertar || state.modalEditar} style={styles}>
      <ModalHeader>
            <div>
              <h3>{state.modalInsertar ? "Insertar Transaccion" : "Editar Transaccion"}</h3>  
            </div>
      </ModalHeader>
      <ModalBody>
        <FormGroup>
              <label>Concepto: </label>
              <input type="text" name="concepto" value={state.concepto} className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})} ></input>
        </FormGroup>
        <FormGroup>
              <label>Descripcion: </label>
              <input type="text" name="descripcion" value={state.descripcion} className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})}>
              </input>
        </FormGroup>
        <FormGroup>
              <label>Monto: </label>
              <input type="text" name="monto" className='form-control' value= {state.monto} onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})}></input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={state.modalInsertar ? 
                                          () => dispatch(insertTransaction(state.concepto, state.descripcion, state.monto, state.token)) : 
                                          () => dispatch(updateTransaction(state.itemSelected, state.concepto, state.descripcion, state.monto))
                                        }>
        {state.modalInsertar ? "Insertar" : "Editar"}
        </Button>
        <Button color="danger" onClick={() => dispatch({type: 'ocultarModal'})}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  )
}

const ModalUsuarios = () => {
  const dispatch = useDispatch();

  const state = useSelector(x => x);
  const styles = { "margin-top": '5.0rem' };

  return (
    <Modal isOpen = {state.modalInsertarUsuario || state.modalEditarUsuario} style={styles}>
      <ModalHeader>
            <div>
              <h3>{state.modalInsertarUsuario ? "Insertar Usuario" : "Editar Usuario"}</h3>  
            </div>
      </ModalHeader>
      <ModalBody>
        <FormGroup>
              <label>Nombre: </label>
              <input type="text" name="nombre" value={state.nombre} className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})} ></input>
        </FormGroup>
        <FormGroup>
          <   label>Mail: </label>
              <input type="text" name="mail" value={state.mail} className='form-control' onChange={ 
                                      (event) => dispatch({type : 'handleChange', payload : event})}>
              </input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={state.modalInsertarUsuario ? 
                                          () => dispatch(insertUsuario(state.nombre, state.mail, state.token)) : 
                                          () => dispatch(updateUsuario(state.usuarioSelected, state.nombre, state.mail, state.token))
                                        }>
        {state.modalInsertarUsuario ? "Insertar" : "Editar"}
        </Button>
        <Button color="danger" onClick={() => dispatch({type: 'ocultarModal'})}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  )
}

const BarraMenu = () => {
  return (
    <ul>
        <li>
          <Link to='/transacciones'>Transacciones</Link>
        </li>
      <li>
        <Link to='/usuarios'>Usuarios</Link>
      </li>
    </ul>
    
  )
}


export const asyncMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState)
  }

  return next(action);
}

export const loggearseEnApi = (userName, password) => async dispatch => {
  try {
    let response = await axios.post(url +  'api/auth', {
        nombre: userName,
        password:password
      });

      console.log(response)
      let token = await response.data;
      console.log(token);
      dispatch({type:'login', payload:token})
      console.log("se termina login")
      dispatch(fetchTransacciones(token));
      console.log("se termina fetch transacciones: ");
      dispatch(fetchUsuarios(token));

  }
  catch(e) {
    console.log(e);
  }
}

export const fetchUsuarios = (token) => async dispatch => {
  const headers = {
    'Autorization': token
  };
  console.log(headers);

  let response = await axios.get(url +  'api/usuarios', {headers : headers});
  let usuarios = await response.data;
  console.log(usuarios);
  dispatch({type:'fetchUsuarios', payload:usuarios})

}

export const fetchTransacciones = (token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };

    let response = await axios.get(url +  'api/transacciones', {headers:headers});
    let transacciones = await response.data;
    dispatch({type:'fetchTransacciones', payload:transacciones})
  }
  catch(e) {
    console.log(e);
  }
}

export const insertUsuario = (nom, mail, token) => async dispatch => {
  try {
    console.log(nom);
    console.log(mail)
    console.log("insertar usuario ", token);
    const headers = {
      'Autorization': token
    };

    let response = await axios.post(url +  'api/usuarios', {
        nombre: nom,
        mail: mail,
        password: '123'
      }, {headers:headers}
    );
      
    dispatch(fetchUsuarios(token));
  }
  catch(e) {
    console.log(e);
  }
}

export const updateUsuario = (id, nom, mail, token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };

    console.log(headers);
    
    let response = await axios.put(url +  'api/usuarios/' + id, {
      nombre: nom,
      mail: mail,
      password: '123'
    }, {headers:headers});
      
    dispatch(fetchUsuarios(token))
  }
  catch(e) {
    console.log(e);
  }
}

export const deleteUsuario = (elem, token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };

    let response = await axios.delete(url +  'api/usuarios/' + elem._id, {headers:headers});
      
    dispatch(fetchUsuarios(token))
  }
  catch(e) {
    console.log(e);
  }
}

export const insertTransaction = (concep, descrip, mon, token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };

    let response = await axios.post(url +  'api/transacciones', {
        concepto: concep,
        monto: mon,
        descripcion : descrip,
      }, {headers:headers}
    );
      
    dispatch(fetchTransacciones(token))
  }
  catch(e) {
    console.log(e);
  }
}

export const deleteTransaction = (elem, token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };

    let response = await axios.delete(url +  'api/transacciones/' + elem._id, {headers:headers});
      
    dispatch(fetchTransacciones(token))
  }
  catch(e) {
    console.log(e);
  }
}

export const updateTransaction = (id, concep, descrip, mon, token) => async dispatch => {
  try {

    const headers = {
      'Autorization': token
    };
    
    let response = await axios.put(url +  'api/transacciones/' + id, {
      concepto: concep,
      descripcion: descrip,
      monto: mon
    }, {headers:headers});
      
    dispatch(fetchTransacciones())
  }
  catch(e) {
    console.log(e);
  }
}

export const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'mostrarModalInsertar': {
      return {
        ...state,
        modalInsertar: true
      }
    }
    case 'mostrarModalInsertarUsuario': {
      return {
        ...state,
        modalInsertarUsuario: true
      }
    }
    case 'mostrarModalEditarUsuario': {
      
      return {
        ...state,
        modalEditarUsuario: true,
        usuarioSelected: action.payload._id,
        nombre: action.payload.nombre,
        mail: action.payload.mail
      }
    }
    case 'mostrarModalEditar': {
      
      return {
        ...state,
        modalEditar: true,
        itemSelected: action.payload._id,
        descripcion: action.payload.descripcion,
        concepto: action.payload.concepto,
        monto : action.payload.monto
      }
    }
    case 'ocultarModal' : {
      return {
        ...state,
        modalInsertar: false,
        modalEditar: false,
        modalEditarUsuario: false,
        modalInsertarUsuario:false
      }
    }
    case 'handleChange' : {
      console.log(action.payload.target.name, action.payload.target.value);
      return {
        ...state,
        [action.payload.target.name]: action.payload.target.value
      }
    }  
    case 'login' : {
      console.log("paso por login")
      return {
        ...state,
        token: action.payload,
        modalEditar : false,
        modalInsertar : false,
        concepto: '',
        monto: '',
        descripcion: ''
      }
    }
    case 'fetchTransacciones' :{
      console.log(action.payload.valor)
      return {
        ...state,
        entities: action.payload.valor,
        modalEditar: false,
        modalInsertar: false,
        concepto: '',
        monto: '',
        descripcion: ''
      }
    }
    case 'fetchUsuarios' :{
      console.log(action.payload.valor)
      return {
        ...state,
        usuarios: action.payload.valor,
        modalEditar: false,
        modalInsertar: false,
        modalEditarUsuario: false,
        modalInsertarUsuario: false,
        concepto: '',
        monto: '',
        descripcion: ''
      }
    }
    default:
      state = initialState;
      console.log("default case");
  }
  return state;
}


function App() {
  
  const dispatch = useDispatch();

  const state = useSelector(x => x);

  return (
    <>
    <NavBar></NavBar>
    <BarraMenu></BarraMenu>
    <Routes>
        <Route path='transacciones' element={<PestaniaTransacciones></PestaniaTransacciones>}></Route>
        <Route path='usuarios' element={<PestaniaUsuarios></PestaniaUsuarios>}></Route>
        <Route path='login' element={<Usuarios></Usuarios>}></Route>
        <Route path='/' element={<Usuarios></Usuarios>}></Route>
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>     

     
    </>
  );
}

export default App;
