import { IsAlpha, IsNotEmpty } from "class-validator";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Famille } from "./Famille";
import { ProduitConditionnement } from "../../gestiondesconditionnements/entity/ProduitConditionnement";
import { Magasin } from "../../gestiondesmagasins/entity/Magasin";
import { Vente } from "../../gestiondespointventes/entity/Vente";


@Entity()
export class Produit{
    @PrimaryGeneratedColumn()
    id:number

    @Column({nullable:true})
    groupeTaxe:string

    @Column({nullable:true})
    modePrix:string

    @Column({nullable:true})
    estService:boolean

    @Column({nullable:true})
    estModeCarreau:boolean

    @Column({unique: true, nullable:false})
    refProd:string

    @Column({nullable:false})
    @IsNotEmpty({message:"Le nom du produit est obligatoire."})
    @IsAlpha()
    nomProd:string

    @Column({nullable:true})
    @IsAlpha()
    marqProd:string

    @Column({nullable:true})
    @IsAlpha()
    modeleProd:string

    @Column({nullable:true})
    descProd:string

    @Column()
    estTaxable:boolean

    @OneToMany(() => ProduitConditionnement, (produitconditionnement) => produitconditionnement.produit)
    produitconditionnements: ProduitConditionnement[]

    @Column({nullable:true})
    codeQR:number

    @Column({nullable:true})
    codeBarre:number

    @Column({nullable:true})
    qtiteLogique:number

    @Column({nullable:true})
    qtitePhysique:number
    
    @Column({nullable:true})
    ecart:number

    @ManyToOne(()=>Famille, (famille)=>famille.produits)
    @JoinColumn()
    famille:Famille[]

    @ManyToOne(()=>Magasin, (magasin)=>magasin.produits)
    @JoinColumn()
    magasin:Magasin[]
    
    @Column({nullable:true})
    seuilAppro:number

    @Column({nullable:true})
    prixVente:number

    @Column({nullable:true})
    seuilAlerte:number

    @ManyToMany(() => Vente, (vente) => vente.produitventes)
    ventes: Vente[]

    @CreateDateColumn()
    createdAt:Timestamp
    
    @UpdateDateColumn()
    updatedAt:Timestamp;

    @DeleteDateColumn()
    deletedAt:Timestamp;
}