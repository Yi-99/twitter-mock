import { useEffect, useRef, useState } from "react";
import UserInfoHook from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { PagedItemPresenter, PagedItemView } from "../../presenters/PagedItemPresenter";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props<T, U> {
	presenterGenerator: (view: PagedItemView<T>) => PagedItemPresenter<T, U>;
	itemComponentGenerator: (item: T) => JSX.Element;
}

export const ItemScroller = <T, U>(props: Props<T, U>) => {
	const { displayErrorMessage } = useToastListener();
	const [items, setItems] = useState<T[]>([]);
	
	const { displayedUser, authToken } = UserInfoHook();

	const itemsReference = useRef(items);
  itemsReference.current = items;

	  // Load initial items
		useEffect(() => {
			loadMoreItems();
		}, []);
	
		const listener: PagedItemView<T> = {
			addItems: (newItems: T[]) => 
				setItems([...itemsReference.current, ...newItems]),
			displayErrorMessage: displayErrorMessage,
		}
	
		const [presenter] = useState(props.presenterGenerator(listener));
	
		const loadMoreItems = async () => {
			presenter.loadMoreItems(authToken!, displayedUser!);
		}

		return (
			<div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenter.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
						{props.itemComponentGenerator(item)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
		)
}