import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { MonnaieCaisse } from "./MonnaieCaisse";

@Entity()
export class Monnaie{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:false})
    @IsNotEmpty({message:"La valeur ne peut pas être nulle"})
    valeurMonnaie:number

    @Column({nullable:false})
    @IsNotEmpty({message:"Le libellé ne peut pas être nul"})
    libelle:string

    @OneToMany(() => MonnaieCaisse, (monnaiecaisse) => monnaiecaisse.monnaie)
    monnaiecaisses: MonnaieCaisse[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}