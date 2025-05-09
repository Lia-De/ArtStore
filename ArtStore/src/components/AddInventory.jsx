
function AddNewInventory({ makerList, setUiState, apiUrl }) {
        const onSubmit = (data) => {
            reset();
            const newInventory = {
                Name: data.name,
                maker: {
                    makerId: parseInt(data.makerId, 10),
                    firstname: data.makerFirst,
                    lastname: data.makerLast,
                },
                description: data.description,
                quantity: parseFloat(data.quantity),
                price: parseInt(data.price, 10),
                imageUrl: data.imageUrl,
                tags: data.tags.split(",").map(tag => tag.trim()),

            }
            // console.log(newInventory);
            setUiState(prev => ({
                ...prev, 
                loading: true,
                error: null
            }));

            axios.post(`${apiUrl}/admin/addInventory`, newInventory, {
                headers: {
                  'Content-Type': 'application/json',
                }
              })
            .then((response) => {
                // setInventory(prev => [...prev, response.data]);
                setUiState(prev => ({...prev, reload: true}));
            })
            .catch ((err) => {
                console.error(err.response?.data || err.message);
                setUiState(prev => ({...prev, error: err}));
            })
            .finally(() => { setUiState(prev => ({...prev, loading: false}));});
        }
        function MakerListElements() {
            return (
                <select id="maker" {...register("makerId")} >
                    <option value="0">Select a maker</option>
                    {makerList.map((item) => (
                        <option key={`maker${item.makerId}`} value={item.makerId}>
                            {item.name}
                        </option>
                    ))}
                </select>)
      }
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Add New Inventory</h3>
                <label htmlFor="maker">Maker:</label>
                <MakerListElements />
                <label htmlFor="newmaker">New Maker:</label>
                <input type="text" id="newmaker" placeholder="Firstname" {...register("makerFirst")}/>
                <input type="text" id="newmaker2" placeholder="Lastname" {...register("makerLast")}/>
                <label htmlFor="name">Item name:</label>
                <input type="text" id="name" {...register("name")}/>

                <label htmlFor="description">Description:</label>
                <input type="text" id="description" {...register("description")} />

                <label htmlFor="quantity">Quantity:</label>
                <input type="number" id="quantity" {...register("quantity")} />

                <label htmlFor="price">Price:</label>
                <input type="number" step="0.01" id="price" {...register("price")} />

                <label htmlFor="imageUrl">Image URL:</label>
                <input type="text" id="imageUrl" {...register("imageUrl")} />

                <label htmlFor="tags">Tags:</label>
                <input type="text" id="tags" {...register("tags")} />

                <button type="submit">Add</button>
            </form>
        );
    }

    export default AddNewInventory;