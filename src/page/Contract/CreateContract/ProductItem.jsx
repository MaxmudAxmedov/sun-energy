import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProductItem({ item, setProducts, products }) {
    const [productCount, setProductCount] = useState(0);
    // useEffect(() => {
    //     const found = products.find((p) => p.product_id === item.id);
    //     if (found) {
    //         setProductCount(found.count);
    //     }
    // }, [products, item.id]);

    useEffect(() => {
        const found = products.find((p) => p.product_id === item.id);
        if (found) {
            setProductCount(found.count);
            form.setValue("kvat", found.kvat || "");
        }
    }, [products, item.id]);

    const [sliderRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1,
        },
    });
    const form = useForm({
        resolver: zodResolver(),
        defaultValues: {
            kvat: 0,
        },
    });

    const kvat = form.watch("kvat");

    useEffect(() => {
        setProducts((prev) => {
            if (productCount > 0) {
                const filtered = prev.filter((p) => p.product_id !== item.id);
                return [
                    ...filtered,
                    {
                        product_id: item.id,
                        count: productCount,
                        total_price: productCount * item.price,
                        product_name: item.name,
                        unit_price: item.price,
                        kvat: kvat || "",
                    },
                ];
            } else {
                return prev.filter((p) => p.product_id !== item.id);
            }
        });
    }, [productCount, item]);
    return (
        <Card className="w-[340px]">
            <CardContent>
                <div
                    ref={sliderRef}
                    className="keen-slider pt-5 rounded overflow-hidden"
                >
                    {item?.photos?.map((src, index) => (
                        <div className="keen-slider__slide" key={index}>
                            <img
                                src={src}
                                alt={`Uploaded image ${index + 1}`}
                                className="w-full h-[200px] object-cover"
                            />
                        </div>
                    ))}
                </div>

                <CardTitle className="my-3 text-[19px]">{item?.name}</CardTitle>
                <div className="border-l-[3px] p-3">
                    <p className="h-[45px]">
                        {item.description.length > 25 ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-pointer break-words">
                                        {item.description.slice(0, 50)}...
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className={"w-[320px] p-3"}>
                                    {item.description}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            item.description
                        )}
                    </p>
                </div>
                <div className="my-3 flex justify-between">
                    <p>{item.price.toLocaleString()} sum</p>
                    <p>{item.count_of_product} dona</p>
                </div>

                <div className="flex justify-between bg-gray-200 p-4">
                    <p>
                        {productCount} x {item.price.toLocaleString()}
                    </p>
                    <p>{(productCount * item.price).toLocaleString()} sum</p>
                </div>
            </CardContent>

            <CardFooter>
                {productCount > 0 ? (
                    <div className="flex justify-between w-full mx-auto">
                        <Button
                            variant="destructive"
                            className="w-[30%]"
                            type="button"
                            onClick={() => setProductCount(productCount - 1)}
                        >
                            -
                        </Button>
                        <p className="border w-[35%] rounded px-3 pt-[5px] text-center">
                            {productCount}
                        </p>
                        <Button
                            className="w-[30%]"
                            type="button"
                            disabled={item.count_of_product === productCount}
                            onClick={() => setProductCount(productCount + 1)}
                        >
                            +
                        </Button>
                    </div>
                ) : (
                    <Button
                        className="w-full"
                        onClick={() => setProductCount(productCount + 1)}
                    >
                        Add
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
