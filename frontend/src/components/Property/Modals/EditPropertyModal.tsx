import {
    Box,
    Button,
    FormControl,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
} from '@chakra-ui/react';
import { IconHome, IconPencil } from '@tabler/icons';
import { useForm } from 'react-hook-form';
import { Property, PropertyUpdateDto } from '../../../types/property';
import GenericInput from '../../Form/GenericInput';
import { useEffect, useState } from 'react';
import countryToCurrency from 'country-to-currency';
import getSymbolFromCurrency from 'currency-symbol-map';
import CountrySelect from 'react-flags-select';

interface EditPropertyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (property: PropertyUpdateDto) => void;
    property: Property | null;
}

const defaultValues = {
    name: '',
    description: '',
    price: 0,
    location: '',
    currency: '',
};

function EditPropertyModal({
    isOpen,
    onClose,
    onSubmit,
    property,
}: EditPropertyModalProps) {
    const { handleSubmit, formState, control, reset, watch, setValue } =
        useForm({
            mode: 'onChange',
            defaultValues,
        });

    useEffect(() => {
        if (property) {
            reset({
                name: property.name,
                description: property.description,
                price: property.price.amount,
                location: property.location,
                currency: property.price.currency,
            });
        }
    }, [property]);

    const currency = watch('currency');
    const [country, setCountry] = useState('US');

    useEffect(() => {
        if (country && Object.keys(countryToCurrency).includes(country)) {
            setValue(
                'currency',
                countryToCurrency[country as keyof typeof countryToCurrency],
            );
        }
    }, [country]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update {property?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Stack spacing={4}>
                            <GenericInput
                                name="name"
                                label="Name"
                                placeholder="Name of the property"
                                control={control}
                                rules={{
                                    required: 'Name is required',
                                }}
                                leftAdornment={<IconPencil />}
                            />
                            <GenericInput
                                name="description"
                                label="Description"
                                placeholder="Description of the property (optional)"
                                control={control}
                            />
                            <GenericInput
                                name="location"
                                label="Location"
                                placeholder="Location of the property"
                                control={control}
                                rules={{
                                    required: 'Location is required',
                                }}
                                leftAdornment={<IconHome />}
                            />
                            <GenericInput
                                name="price"
                                label="Price"
                                placeholder="Price of the property"
                                control={control}
                                type="number"
                                rules={{
                                    required: 'Price is required',
                                    min: 1,
                                }}
                                rightAdornment={getSymbolFromCurrency(currency)}
                            />
                            <CountrySelect
                                searchable
                                selected={country}
                                onSelect={(country) => setCountry(country)}
                            />
                            <Box w="100%">
                                <Button
                                    id="submit"
                                    w="100%"
                                    colorScheme="teal"
                                    disabled={
                                        !formState.isValid ||
                                        formState.isSubmitting ||
                                        property === null
                                    }
                                    onClick={handleSubmit((values) =>
                                        onSubmit({
                                            id: property?.id ?? 0,
                                            property: {
                                                ...values,
                                                price: Number(values.price),
                                            },
                                        }),
                                    )}>
                                    Update Property
                                </Button>
                            </Box>
                        </Stack>
                    </FormControl>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default EditPropertyModal;
