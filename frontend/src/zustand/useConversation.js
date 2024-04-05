import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),//same as use and set.
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useConversation;

//Takes set as an argument and return object on callback/