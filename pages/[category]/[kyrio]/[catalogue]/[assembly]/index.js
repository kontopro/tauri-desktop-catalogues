import Link from "next/link";
import Subnav from "@/components/Subnav"
import { supabase } from "@/lib/supabaseClient"

export default function Assembly( { category, kyrio, catalogue, assembly, sub_assemblies } ) {
    
    const parent_assembly = sub_assemblies.length?1:0

    return  <main className='main'>
    <Subnav />
                {/* <div>You are in assembly <b>{assembly.assid}!</b></div> */}
                {/* <div>It is {parent_assembly?<b>A</b>:<b>NOT A</b>} <b>parent</b> assembly</div> */}
                
                {/* Λίστα με υπο συγκροτήματα και σύνδεσμοι προς αυτά */}
                <div className="cards-wrapper">{sub_assemblies.map(x => 
                <div key={x.id} className="card">
                    <div className='card-title'>  
                        <p><Link href={`/${category}/${kyrio}/${catalogue}/tree/?assid=${x.assid}`}>{x.name}</Link></p>
                    </div>
                    <div className='card-desc'>
                        <p><Link href={`/${category}/${kyrio}/${catalogue}/tree/?assid=${x.assid}`}><button>Επιλογή</button></Link></p>
                    </div>
                    </div>)}
                </div>
                    
            </main>
} 

export async function getStaticPaths(){

    // Εφόσον στο υπόψη url φαίνονται κατηγορία, κύριο, κατάλογος και κύριο συγκρότημα, θέλω τα slug τους ως παραμέτρους του paths

    // inner join ώστε να κουμπώσει κάθε κύριο με την κατηγορία του και τους καταλόγους του
    const {data: assemblies, error} = await supabase.from('assembly').select('assid, catalogues: catalogue_id(slug,kyria: kyrio_id(slug,categories:category_id (slug)))').is('parent_id',null)    
    
    // Δημιουργία παραμέτρων
    const paths = assemblies.map((x) => ({
        params: {assembly: x.assid,catalogue: x.catalogues.slug,kyrio: x.catalogues.kyria.slug,category: x.catalogues.kyria.categories.slug}
    }))
    
    return {paths, fallback: false}
}

export async function getStaticProps( { params } ){

    // Για τις πληροφορίες του Καταλόγου επιστρέφω ολόκληρο τον κατάλογο
    // Για το link προς κάθε κύριο συγκρότημα απαιτείται να επιστρέψω τα slug της κατηγορίας, του κυρίου υλικού, assid συγκρότημα και υποσυγκρότημα
    
    // Τσίμπα το slug του Καταλόγου, θέλω και το id ώστε να έχω unique assid και catalogue_id
    const catalogue = params.catalogue
    
    // Τσίμπα το slug του Κυρίου Υλικού 
    const kyrio = params.kyrio

    // Τσίμπα το slug της Κατηγορίας 
    const category = params.category

    // Επιπλεόν ανεύερση catalogue_id για μοναδικότητα συγκροτήματος (δεν έχω μοναδικά slug στο assembly)
    const {data, error: err0} = await supabase.from('catalogue').select('id').eq('slug',catalogue)
    const cat_id = data[0].id

    // Τσίμπα το Κύριο Συγκρότημα από το assid,catalogue_id (unique)
    const {data: assemblies, error: err1} = await supabase.from('assembly').select().eq('assid',params.assembly).eq('catalogue_id',cat_id)
    const assembly = assemblies[0]    
    
    // Τσίμπα υπο-συγκροτήματα
    const {data: sub_assemblies, error: err2} = await supabase.from('assembly').select().eq('parent_id',assembly.id)
    
    return {
        props: {category, kyrio, catalogue, assembly, sub_assemblies}
    }
}