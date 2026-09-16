import firebaseDB from '@/firebase-config'
import { doc, collection, getDocs, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore/lite'

class DbOperations {
    constructor(collectionTitle) {
        this.dbCollection = collection(firebaseDB, `/${collectionTitle}`)
    }
    getListFromSnapshot(snapshot) {
        const list = []
        snapshot.docs.forEach((doc) => {
            list.push({
                id: doc.id,
                ...doc.data(),
            })
        })
        return list
    }
    loadItemsList() {
        return new Promise((resolve, reject) => {
            getDocs(this.dbCollection)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    addItem(item) {
        return new Promise((resolve, reject) => {
            const newDoc = doc(this.dbCollection)

            setDoc(newDoc, {
                ...item, // 1. Сначала копируем все данные из переданного объекта
                id: newDoc.id, // 2. Записываем id документа поверх любых возможных значений из item
            })
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    deleteItem(id) {
        return new Promise((resolve, reject) => {
            deleteDoc(doc(this.dbCollection, id))
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }

    updateItem(itemId, data) {
        return new Promise((resolve, reject) => {
            const oldDocRef = doc(this.dbCollection, itemId)
            updateDoc(oldDocRef, data)
                .then(() => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    loadFilteredData(fieldTitle, compareOperator, valueToCompare) {
        const q = query(this.dbCollection, where(fieldTitle, compareOperator, valueToCompare))
        return new Promise((resolve, reject) => {
            getDocs(q)
                .then((querySnapshot) => {
                    resolve(this.getListFromSnapshot(querySnapshot))
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}

export default DbOperations
