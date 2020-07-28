/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import countObjectProperties from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

    users: {},
    services: {},
    rooms: {},

    authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',

    modals: {
      login: false,
      register: false,
    },
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value;
    },
    SET_ROOM(state, { newRoom, roomId }) {
      Vue.set(state.rooms, roomId, newRoom);
    },
    APPEND_ROOM_TO_USER(state, { roomId, userID }) {
      Vue.set(state.users[userID].rooms, roomId, roomId);
    },
    SET_ITEM(state, { item, id, resource }) {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem);
    },
  },
  actions: {

    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room;
      const roomID = `room${crypto.getRandomValues(new Uint32Array(1)).toString('hex')}`;
      newRoom['.key'] = roomID;
      newRoom.userId = state.authId;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };

      firebase.firestore().collection('rooms').doc(roomID).set(newRoom).then(resultRoom => {
        const roomObj = {}
        roomObj[roomID] = roomID
        firebase.firestore().collection('users').doc(newRoom.userId).set({
          rooms: { ...roomObj }
        }, { merge: true }).then(updateUserResult => {
          commit('SET_ROOM', { newRoom, roomID });
          commit('APPEND_ROOM_TO_USER', { roomID, userID: newRoom.userId });
          return Promise.resolve(state.rooms[roomID])
        })
      })
    },

    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve, reject) => {
      let instance = firebase.firestore().collection('rooms');
      if (limit) {
        instance = instance.limit(limit);
      }

      instance.get().then((result) => {
        result.docs.forEach((room) => {
          commit('SET_ITEM', { item: room.data(), id: room.id, resource: 'rooms' });
        });
        resolve(Object.values(state.rooms));
      }).catch(err => reject(new Error(err)));
    }),

    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve, reject) => {
      firebase.firestore().collection('users').doc(id).get()
        .then((result) => {
          commit('SET_ITEM', { resource: 'users', id: result.id, item: result.data() });
          resolve(state.users[id]);
        })
        .catch(err => reject(new Error(err)));
    }),

    FETCH_SERVICES: ({ state, commit }) => {
      firebase.firestore().collection('services').get().then( result => {
        result.docs.forEach(service => 
          commit('SET_ITEM', { item: service.data(), id: service.id, resource: 'services'})
        )
      })
    }
  },
  getters: {
    modals: state => state.modals,
    authUser: state => state.users[state.authId],
    rooms: state => state.rooms,
    userRoomsCount: state => id => countObjectProperties(state.users[id].rooms),
    services: state => state.services
  },
});
