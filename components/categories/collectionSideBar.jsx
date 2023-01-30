import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap-accordion'
import { Scrollbar } from "react-scrollbars-custom";

const CollectionSideBar = props => {
    // const {state} = useLocation();
    const data = props.data;
    const filters = []

    const [dataCate, setDataCate] = useState(
        []
    )
    const visible = props.visible;
    const setvisible = props.setvisible;


    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let attributes = []
        Object.entries(data).forEach(([key, value]) => {
            let contents = []
            Object.entries(value).forEach(([key1, value1]) => {
                contents.push({ field: `${key1} (${value1.count})`, checked: '', count: value1.count })

            });
            // contents.sort((a, b) => b.count - a.count);
            attributes.push({ title: key, content: contents });
        });
        setDataCate([...filters, ...attributes])

        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 500)
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [props]);


    const [selected, setSelected] = useState(null);
    const handleAccordion = (id) => {
        if (selected === id) {
            setSelected(null);
        } else {
            setSelected(id);
        }
    };
    return (
        <div className="dark:bg-jacarta-700 dark:border-jacarta-600 bg-light-base rounded-2lg border-jacarta-100 flex flex-col border text-center transition-shadow hover:shadow-lg">
                <h1 className='text-lg py-3 dark:bg-jacarta-800 rounded-2lg'>Filters</h1>
                <div className='scrollbar-custom dark:bg-jacarta-700 rounded-3lg dark:border-jacarta-600 border-jacarta-100 w-full max-h-80 overflow-y-auto px-4 py2'>
                    <div>
                        <form>
                            <div className="mt-4 flex justify-between items-center space-x-2">
                                <label htmlFor="terms1" className="dark:text-jacarta-200 text-sm">
                                    For Sales
                                </label>
                                <input
                                    type="checkbox"
                                    id="terms1"
                                    checked={props.sale}
                                    className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                                    onChange={(ev) => props.setsale(ev.target.checked) }
                                />
                            </div>
                            <div className="mt-4 flex justify-between items-center space-x-2">
                                <label htmlFor="terms2" className="dark:text-jacarta-200 text-sm">
                                    Most Viewed
                                </label>
                                <input
                                    type="checkbox"
                                    id="terms2"
                                    checked={props.view}
                                    className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                                    onChange={(ev) => props.setview(ev.target.checked)}
                                />
                            </div>
                            <div className="mt-4 flex justify-between items-center space-x-2">
                                <label htmlFor="terms3" className="dark:text-jacarta-200 text-sm">
                                    Most Liked
                                </label>
                                <input
                                    type="checkbox"
                                    id="terms3"
                                    checked={props.like}
                                    className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                                    onChange={(ev) => props.setlike(ev.target.checked)}
                                />
                            </div>
                        </form>
                    </div>
                    <h1 className='pt-5 mb-3 mx-4'>Attributes</h1>
                    {
                        dataCate.map((item, id) => (
                            <div
                                key={id}
                                className="accordion-item dark:border-jacarta-600 border-jacarta-100 mb-5 overflow-hidden rounded-lg border"
                            >
                                <h2
                                    className="accordion-header text-sm"
                                    id="faq-heading-1"
                                    onClick={() => handleAccordion(id)}
                                >
                                    <button
                                        className={
                                            selected === id
                                                ? "accordion-button dark:bg-jacarta-700 font-display text-jacarta-700 relative flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:text-white "
                                                : "accordion-button dark:bg-jacarta-700 font-display text-jacarta-700 collapsed relative flex w-full items-center justify-between bg-white px-4 py-3 text-left dark:text-white "
                                        }
                                        type="button"
                                    >
                                        <span>{item.title}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            height="24"
                                            className="accordion-arrow fill-jacarta-700 h-4 w-4 shrink-0 transition-transform dark:fill-white"
                                        >
                                            <path fill="none" d="M0 0h24v24H0z"></path>
                                            <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                                        </svg>
                                    </button>
                                </h2>
                                <div
                                    id="faq-1"
                                    className={
                                        selected === id
                                            ? "accordion-collapse collapse show "
                                            : "accordion-collapse collapse"
                                    }
                                    aria-labelledby="faq-heading-1"
                                    data-bs-parent="#accordionFAQ"
                                >
                                    <div className="accordion-body dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 border-t bg-white p-3">
                                        <form>
                                            {
                                                item.content.map((itemm, index1) => (
                                                    <div key={index1} className="mt-2 flex justify-between items-center">
                                                        <label htmlFor={itemm.field+index1} className="dark:text-jacarta-200 text-sm">
                                                        {itemm.field}
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            id={itemm.field+index1}
                                                            className="checked:bg-accent dark:bg-jacarta-600 text-accent border-jacarta-200 focus:ring-accent/20 dark:border-jacarta-500 h-5 w-5 self-start rounded focus:ring-offset-0"
                                                            onClick={(ev) => props.clickFilter(id,index1, ev.target.checked)} 
                                                            checked={props.collectionFilter[id][index1] === 0 ? false: true}
                                                        />
                                                    </div>
                                                ))
                                            }
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='dark:bg-jacarta-800 pt-3 rounded-lg'>
                    <button
                        className='dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-2 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
                        onClick={() => props.clear()}
                    >
                        <span className="text-sm font-medium capitalize">clear</span>
                    </button>
                    <button
                        className='dark:border-jacarta-600 dark:bg-jacarta-700 group dark:hover:bg-accent hover:bg-accent border-jacarta-100 mr-2.5 mb-2.5 inline-flex items-center rounded-xl border bg-white px-4 py-2 hover:border-transparent hover:text-white dark:text-white dark:hover:border-transparent'
                        onClick={() => props.done()}
                    >
                        <span className="text-sm font-medium capitalize">done</span>
                    </button>
                </div>
            </div>
    )
}

export default CollectionSideBar